import { TranscriptResponse, YoutubeTranscript } from 'youtube-transcript';
import * as ytdl from 'ytdl-core';

export const getYoutubeTranscript = async (url: string) => {
  const transcript = await YoutubeTranscript.fetchTranscript(url);
  return transcript;
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
