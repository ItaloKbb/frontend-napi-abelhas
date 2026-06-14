import { FileType, StatusAmostra, StatusAnalise } from "@/constants";

// --- Cidades IBGE ---

export interface CidadeIBGE {
  id: string;
  cidade: string;
  estado: string;
  regiao: string;
  bioma: string;
}

// --- Produtores ---

export interface Produtor {
  id: string;
  orgId: string;
  nome: string;
  cidadeId?: string;
  cidade?: CidadeIBGE;
  createdAt: string;
  updatedAt: string;
}

// --- Responsáveis ---

export interface Responsavel {
  id: string;
  orgId: string;
  nome: string;
  instituicaoId: string;
  cidadeId?: string;
  cidade?: CidadeIBGE;
  createdAt: string;
  updatedAt: string;
}

// --- Tipos de Amostra ---

export interface TipoAmostra {
  id: string;
  nome: string;
  descricao?: string;
  createdAt: string;
  updatedAt: string;
}

// --- Tipos de Análise ---

export interface TipoAnalise {
  id: string;
  nome: string;
  createdAt: string;
  updatedAt: string;
}

// --- Abelhas ---

export interface Abelha {
  id: string;
  nomeCientifico: string;
  nomePopular?: string;
  semFerrao: boolean;
  nativa: boolean;
  descricao?: string;
  createdAt: string;
  updatedAt: string;
}

// --- Pontos de Coleta ---

export interface PontoColeta {
  id: string;
  orgId: string;
  nome: string;
  latitude: number;
  longitude: number;
  raio?: number;
  cidadeId: string;
  cidade?: CidadeIBGE;
  createdAt: string;
  updatedAt: string;
}

// --- Amostras ---

export interface Amostra {
  id: string;
  orgId: string;
  nome: string;
  dataColeta: string;
  status: StatusAmostra;
  pontoColetaId: string;
  pontoColeta?: PontoColeta;
  abelhaId: string;
  abelha?: Abelha;
  produtorId: string;
  produtor?: Produtor;
  tipoAmostraId: string;
  tipoAmostra?: TipoAmostra;
  analises?: Analise[];
  fileGroups?: FileGroup[];
  createdAt: string;
  updatedAt: string;
}

// --- Análises ---

export interface Analise {
  id: string;
  orgId: string;
  status: StatusAnalise;
  amostraId: string;
  amostra?: Amostra;
  tipoAnaliseId: string;
  tipoAnalise?: TipoAnalise;
  responsavelId: string;
  responsavel?: Responsavel;
  fileGroups?: FileGroup[];
  createdAt: string;
  updatedAt: string;
}

// --- File Groups ---

export interface FileGroup {
  id: string;
  orgId: string;
  amostraId?: string;
  amostra?: Amostra;
  analiseId?: string;
  analise?: Analise;
  files?: AppFile[];
  createdAt: string;
  updatedAt: string;
}

export interface AppFile {
  id: string;
  url: string;
  type: FileType;
  uploadedByUserId?: string;
  uploadedByName?: string;
  fileGroupId: string;
  createdAt: string;
  updatedAt: string;
}

// --- Respostas genéricas ---

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}
