import { getConnection } from 'typeorm';
import ControleAi from './ControleAi'

export default class BaseModel { 
  
  id: number;

  async generateId() {
    const connection = getConnection();

    const thisRep = connection.getRepository(this.constructor);
    const thisTable = thisRep.metadata.tablePath;

    const aiRep = connection.getRepository(ControleAi);

    const thisAi = await aiRep.findOne({tabela: thisTable}) || new ControleAi(thisTable);

    thisAi.ultimoId += 1;
    this.id = thisAi.ultimoId;

    await aiRep.save(thisAi);
  }

}