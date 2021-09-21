export interface userProjects { 
  pid?: string;
  rate?: number;
  status?: string;
}

export interface UserProfile {
  uid: string;
  displayName?: string;
  email: string;
  role: string;
  projects?: userProjects
}

export interface Projects{
  id?: string;
  titulo?: string;
  ciudad?: string;
  pais?: string;
  sup?: string;
  hab?: string;
  bath?: string;
  year?: string;
  bModel?: string;
  rentabilidad?: string;
  desc?: string;
  fotoAntes?: string;
  fotoDsps?: string;
  fotoFinal?: string;
  fotosObra?: string[];
}
