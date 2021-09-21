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
  tituloES?: string;
  tituloEN?: string;
  tituloFR?: string;
  ciudad?: string;
  pais?: string;
  sup?: string;
  hab?: string;
  bath?: string;
  year?: string;
  bModelES?: string;
  bModelEN?: string;
  bModelFR?: string;
  rentabilidad?: string;
  descES?: string;
  descEN?: string;
  descFR?: string;
  fotoAntes?: string;
  fotoDsps?: string;
  fotoFinal?: string;
  fotosObra?: string[];
}
