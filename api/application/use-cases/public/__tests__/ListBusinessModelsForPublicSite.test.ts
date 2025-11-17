import { describe, it, expect } from 'vitest';
import { ListBusinessModelsForPublicSite } from '../ListBusinessModelsForPublicSite.js';
import { IBusinessModelRepository } from '../../../ports/IBusinessModelRepository.js';
import { BusinessModel, createBusinessModel } from '../../../../domain/business-models/index.js';
import { Result, Ok } from '../../../../../shared/types/Result.js';

class MockBusinessModelRepository implements IBusinessModelRepository {
  async listPublished(): Promise<Result<BusinessModel[], Error>> {
    const mockModels: BusinessModel[] = [
      createBusinessModel({
        id: '1',
        internalCode: 'test_model',
        name: 'Test Model',
        description: 'Test Description',
        displayOrder: 1,
        slug: 'test-model'
      })
    ];
    return Ok(mockModels);
  }

  async findBySlug(_slug: string): Promise<Result<BusinessModel | null, Error>> {
    return Ok(null);
  }
}

describe('ListBusinessModelsForPublicSite', () => {
  it('should return list of published business models', async () => {
    const repository = new MockBusinessModelRepository();
    const useCase = new ListBusinessModelsForPublicSite(repository);
    
    const result = await useCase.execute();
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toHaveLength(1);
      expect(result.value[0].name).toBe('Test Model');
      expect(result.value[0].internalCode).toBe('test_model');
    }
  });
});
