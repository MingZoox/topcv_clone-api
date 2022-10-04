import { Test, TestingModule } from "@nestjs/testing";
import { CVService } from "./cv.service";

describe("CvService", () => {
  let service: CVService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CVService],
    }).compile();

    service = module.get<CVService>(CVService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
