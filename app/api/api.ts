const API_URL=process.env.EXPO_PUBLIC_API_URL;
import axios, { AxiosResponse } from 'axios';

export interface Categoria{
    id:number;
    nombre:string;
}
  // Interface para la tabla 'plato'
  interface Plato {
    id: number;
    id_restaurante: number;
    nombre?: string;
    foto?: string;
    precio: number;
  }
  
  // Interface para la tabla 'reserva'
  interface Reserva {
    id: number;
    id_restaurante: number;
    id_usuario: number;
    fecha: string;
    hora: string;
    num_personas: number;
  }
  
  // Interface para la tabla 'restaurante'
  export interface Restaurante {
    id: number;
    categoria_id: number;
    nombre: string;
    correo: string;
    password_restaurante: string;
    direccion: string;
    foto: string;
    aforo: number;
    hora_apertura: string;
    hora_cierre: string;
  }
  
  interface Usuario {
    id: number;
    nombre?: string;
    apellido?: string;
    telefono?: number;
    correo: string;
    password_usuario: string;
  }
  export const getRestaurantes = async (): Promise<Restaurante[]> => {
    try {
      const response: AxiosResponse<Restaurante[]> = await axios.get(`${API_URL}/restaurantes`);
      return response.data;
    } catch (error:any) {
      throw new Error('Error al obtener los restaurantes: ' + error.message);
    }
  };
  export const getRestauranteByID = async (id: number): Promise<Restaurante> => {
    try {
      const response = await fetch(`${API_URL}/restaurantes/${id}`);
      if (!response.ok) {
        throw new Error('Error al obtener el restaurante.');
      }
      const data = await response.json();
      return data as Restaurante;
    } catch (error) {
      throw new Error('Error al obtener el restaurante con el id');
    }
  };
  
  