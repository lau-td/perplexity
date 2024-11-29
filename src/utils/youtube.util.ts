import { TranscriptResponse, YoutubeTranscript } from 'youtube-transcript';
import * as ytdl from 'ytdl-core';
import * as path from 'path';
import * as fs from 'fs';
import * as youtubedl from 'youtube-dl-exec';
import { randomUUID } from 'crypto';

export const getYoutubeTranscript = async (url: string) => {
  const transcript = await YoutubeTranscript.fetchTranscript(url);
  return transcript;
};

const parseWebVTT = (vttContent: string): TranscriptResponse[] => {
  const lines = vttContent.split('\n');
  const transcript: TranscriptResponse[] = [];
  let currentText = '';
  let currentStart = 0;
  let currentEnd = 0;

  const parseTimestamp = (timestamp: string): number => {
    const [hours, minutes, seconds] = timestamp.split(':');
    const [secs, millis] = seconds.split('.');
    return (
      parseInt(hours) * 3600 +
      parseInt(minutes) * 60 +
      parseInt(secs) +
      parseInt(millis) / 1000
    );
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.includes('-->')) {
      if (currentText) {
        transcript.push({
          offset: currentStart,
          duration: currentEnd - currentStart,
          text: currentText.trim(),
        });
        currentText = '';
      }

      const [start, end] = line.split(' --> ');
      currentStart = parseTimestamp(start);
      currentEnd = parseTimestamp(end);
    } else if (
      line &&
      !line.startsWith('WEBVTT') &&
      !line.startsWith('Kind:') &&
      !line.startsWith('Language:')
    ) {
      currentText += line + ' ';
    }
  }

  if (currentText) {
    transcript.push({
      offset: currentStart,
      duration: currentEnd - currentStart,
      text: currentText.trim(),
    });
  }

  return transcript;
};

export const getYoutubeTranscriptV2 = async (
  url: string,
): Promise<TranscriptResponse[]> => {
  try {
    const randomId = randomUUID();
    const outputPath = path.resolve(process.cwd(), `transcript_${randomId}`);

    // Download subtitles/transcript with timestamps
    await youtubedl.exec(url, {
      skipDownload: true, // Don't download the video
      writeAutoSub: true, // Get auto-generated subtitles
      subLang: 'en', // Language code for subtitles
      output: outputPath, // Output file path
      writeSub: true, // Write subtitle file
      subFormat: 'vtt', // Get VTT format (includes timestamps)
    });

    const transcriptVtt = fs.readFileSync(`${outputPath}.en.vtt`, 'utf8');
    const transcript = parseWebVTT(transcriptVtt);
    fs.unlinkSync(`${outputPath}.en.vtt`);

    return transcript;
  } catch (error) {
    console.error('Error fetching transcript:', error.message);
    return null;
  }
};

export const convertTranscriptToText = (transcript: TranscriptResponse[]) => {
  return transcript
    .map((item) => {
      const startTime = formatTimestamp(item.offset);
      const endTime = formatTimestamp(item.offset + item.duration);
      const cleanText = item.text
        .replace(/&amp;#39;/g, "'")
        .replace(/&amp;/g, '&')
        .replace(/[\n\r]+/g, ' ')
        .trim();
      return `[${startTime}] --> [${endTime}]: ${cleanText}`;
    })
    .join('\n');
};

export const convertTranscriptToJson = (transcript: TranscriptResponse[]) => {
  return transcript.map((item) => ({
    start: item.offset,
    end: item.offset + item.duration,
    text: item.text,
  }));
};

const formatTimestamp = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const milliseconds = Math.floor((seconds % 1) * 1000);

  const hoursStr = String(hours).padStart(2, '0');
  const minutesStr = String(minutes).padStart(2, '0');
  const secondsStr = String(remainingSeconds).padStart(2, '0');
  const millisecondsStr = String(milliseconds).padStart(3, '0');

  return `${hoursStr}:${minutesStr}:${secondsStr}.${millisecondsStr}`;
};

export const getYoutubeInfo = async (url: string) => {
  try {
    const info = await ytdl.getInfo(url);
    return {
      videoId: info.videoDetails.videoId,
      videoUrl: info.videoDetails.video_url,
      title: info.videoDetails.title,
      description: info.videoDetails.description,
      duration: parseInt(info.videoDetails.lengthSeconds),
      category: info.videoDetails.category,
      viewCount: parseInt(info.videoDetails.viewCount),
      publishDate: info.videoDetails.publishDate,
      uploadDate: info.videoDetails.uploadDate,
      ageRestricted: info.videoDetails.age_restricted,
      dislikes: info.videoDetails.dislikes,
      likes: info.videoDetails.likes,
      channelId: info.videoDetails.channelId,
      thumbnailUrl: info.videoDetails.thumbnails[0].url,
      author: info.videoDetails.author,
      embed: info.videoDetails.embed,
    };
  } catch (error) {
    throw new Error(`Failed to fetch YouTube video info: ${error.message}`);
  }
};
