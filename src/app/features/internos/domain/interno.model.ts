export enum EstadoEnum {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
  LIBRE = 'LIBRE',
  BLOQUEADO = 'BLOQUEADO'
}

export enum SexoEnum {
  M = 'M',
  F = 'F'
}

export interface Interno {
  id: string;
  nombres: string;
  apellidos?: string | null;
  idUbicacion: number;
  
  // Opcionales con valores por defecto o null
  cortesia?: number | null;
  fechaHoraRegistro?: number | null;
  activo?: boolean;
  clave?: string | null;
  fechaNacimiento?: string | null;  // ISO date string
  
  desarrollo?: boolean;
  cambiarClave?: boolean;
  idPerfil?: number | null;
  
  pabellon?: string | null;
  piso?: string | null;
  ala?: string | null;
  
  estado?: EstadoEnum;
  fechaIngreso?: string | null;  // ISO datetime string
  requeridoAgente?: boolean;
  
  sexo?: SexoEnum | null;
  fechaHoraUltimaLlamada?: number | null;
  
  prefijoPenal?: number | null;
  identificacion?: string | null;
  tratamientoDatos?: number | null;
  idGeografia?: number | null;
}