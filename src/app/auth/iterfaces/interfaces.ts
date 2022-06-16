
export interface Asignacion {
    id: number;
    nombre: string;
    seleccionado: boolean;
    archivoPath: string;
    puntuacion: number;
    codigoUsuario: number;
    archivoContiene: boolean;
    codigoVariante:String;
    url: string;
}

export interface Variante {
    id: number;
    nombre: string;
    codigoComponente: string;
    listaAsignacion: Asignacion[];
}

export interface SubVariable {
    id: number;
    nombre: string;
    listaVariante: Variante[];
}

export interface Variable {
    id: number;
    nombre: string;
    listaSubVariable: SubVariable[];
}

export interface Componente {
    id: number;
    nombre: string;
    listaVariables: Variable[];
}

export interface Usuario {
    id: number;
    nombreUsuario: string;
    contrasena: string;
    nombreGad: string;
}

export interface Categoria {
    name: string;
}

export interface Dato {
    name: string;
    data: number[];
}

export interface DatoP {
    name: string;
    y: number;
}

export interface ResultadoVariable {
    id: number;
    codigoVariable: number,
    usuario: Usuario;
    normalizacion: number;
}

export interface ResultadoVariante {
    id: number;
    codigoVariante: number;
    codigoVariable: number;
    usuario: Usuario;
    resultado: number;
    normalizacion: number;
}

export interface Recomendacion {
    id: number;
    nombre: string;
    data: Rango[]
}

export interface Rango {
    rango1: string;
    rango2: string;
    descripcion: string
}



