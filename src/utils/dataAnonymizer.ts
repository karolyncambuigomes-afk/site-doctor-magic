import { Model } from '@/data/models';

export interface AnonymizedModel extends Omit<Model, 'name' | 'age' | 'measurements' | 'hair' | 'eyes' | 'nationality' | 'education' | 'interests' | 'description'> {
  name: string;
  age?: number;
  measurements?: string;
  hair?: string;
  eyes?: string;
  nationality?: string;
  education?: string;
  interests?: string[];
  description: string;
}

/**
 * Anonymizes sensitive model data for public viewing
 * Full details are only available to authenticated users
 */
export const anonymizeModelData = (model: Model, isAuthenticated: boolean = false): Model | AnonymizedModel => {
  if (isAuthenticated) {
    return model; // Return full data for authenticated users
  }

  // Return anonymized data for public access
  return {
    ...model,
    name: model.name.split(' ')[0] || model.name, // First name only
    age: undefined, // Hide age
    measurements: undefined, // Hide measurements
    hair: undefined, // Hide hair color
    eyes: undefined, // Hide eye color
    nationality: undefined, // Hide nationality
    education: undefined, // Hide education
    interests: [], // Hide interests
    description: "Detailed information available after registration. Contact us to learn more about our elegant and sophisticated companion services.", // Generic description
  };
};

/**
 * Anonymizes an array of models
 */
export const anonymizeModelsArray = (models: Model[], isAuthenticated: boolean = false): (Model | AnonymizedModel)[] => {
  return models.map(model => anonymizeModelData(model, isAuthenticated));
};