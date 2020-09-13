import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return object include database property when isWithoutDatabase is false', () => {
    const config = AppService.getMySQLDatabaseConfig(false);

    expect(config).toHaveProperty('database');
  });

  it('should return object not include database property when isWithoutDatabase is true', () => {
    const config = AppService.getMySQLDatabaseConfig(true);

    expect(config).not.toHaveProperty('database');
  });

  it('should call query function when initDatabase function was called', async () => {
    const client = service.getClient();
    const querySpy = jest.spyOn(client, 'query').mockImplementation(jest.fn());

    await service.initDatabase();
    expect(querySpy).toHaveBeenCalledTimes(1);
  });

  it('should call query function with query string when initDatabase function was called', async () => {
    const queryStr = `CREATE DATABASE IF NOT EXISTS ${process.env.DB_MYSQL_DATABASE};`;
    const client = service.getClient();
    const querySpy = jest.spyOn(client, 'query').mockImplementation(jest.fn());

    await service.initDatabase();
    expect(querySpy).toHaveBeenCalledWith(queryStr);
  });

  it('should call authenticate function when testConnectToMySQL function was called', async () => {
    const client = service.getClient();
    const authenticateSpy = jest
      .spyOn(client, 'authenticate')
      .mockImplementation(jest.fn());

    await service.testConnectToMySQL();
    expect(authenticateSpy).toHaveBeenCalledTimes(1);
  });

  it('should call close function when closeConnection function was called', async () => {
    const client = service.getClient();
    const closeSpy = jest.spyOn(client, 'close').mockImplementation(jest.fn());

    await service.closeConnection();
    expect(closeSpy).toHaveBeenCalledTimes(1);
  });
});
