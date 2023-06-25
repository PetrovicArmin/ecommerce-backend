import { ModelAttributes, ModelOptions } from 'sequelize';

interface ModelData {
    modelName: string,
    attributes: ModelAttributes,
    options: ModelOptions
};

export default ModelData;