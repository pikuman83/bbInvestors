export interface rateList {
  id?: string|undefined;
  pid: string;
  rate: number|undefined;
  user: string
}

export interface UserProfile {
  uid: string;
  displayName?: string;
  email: string;
  role: string;
}

export interface Projects{
  id?: string;
  time?: Date;
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
  user?: string;
  lang?: string; 
  servicios?: string[];
  public?: boolean,
  rate?: number
}

export interface News{
  id?: string;
  time?: Date;
  cat?: string;
  title?: string;
  url?: string;
  src?: string;
  img?: string;
  downloadUrl?: string 
}
