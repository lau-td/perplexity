export interface IGenericRepository<DomainEntity> {
  find(
    condition: Partial<{ [K in keyof DomainEntity]: DomainEntity[K] }>,
  ): Promise<DomainEntity[]>;

  count(
    condition: Partial<{ [K in keyof DomainEntity]: DomainEntity[K] }>,
  ): Promise<number>;

  findOne(
    condition: Partial<{ [K in keyof DomainEntity]: DomainEntity[K] }>,
  ): Promise<DomainEntity | null>;

  create(entity: Partial<DomainEntity>): Promise<DomainEntity>;

  createMany(entities: Partial<DomainEntity>[]): Promise<DomainEntity[]>;

  update(id: string, entity: Partial<DomainEntity>): Promise<DomainEntity>;

  delete(id: string): Promise<void>;

  deleteByCondition(
    condition: Partial<{ [K in keyof DomainEntity]: DomainEntity[K] }>,
  ): Promise<void>;

  softDelete(id: string): Promise<void>;
}
