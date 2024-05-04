const API_URL=process.env.EXPO_PUBLIC_API_URL;
import axios, { AxiosResponse } from 'axios';

export interface Categoria{
    id:number;
    nombre:string;
}
  // Interface para la tabla 'plato'
export  interface Plato {
    id: number;
    id_restaurante: number;
    nombre: string;
    foto: string;
    precio: number;
  }
export  interface PlatoInsert {
    id_restaurante: number;
    nombre: string;
    foto: string;
    precio: number;
  }
  
  // Interface para la tabla 'reserva'
  export interface  Reserva {
    id: number;
    id_restaurante: number;
    id_usuario: number;
    fecha: string;
    hora: string;
    num_personas: number;
    estado:string;
  }
  // Interface para la tabla 'reserva'
  export interface  ReservaInsert {
    id_restaurante: number;
    id_usuario: number;
    fecha: string;
    hora: string;
    num_personas: number;
    estado:string;
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
    horaApertura: string;
    horaCierre: string;
  }

  export interface RestauranteInsert {
    categoria_id: number;
    nombre: string;
    correo: string;
    password_restaurante: string;
    direccion: string;
    foto: string;
    aforo: number;
    horaApertura: string;
    horaCierre: string;
  }

  // Interface para la tabla 'usuario'
  export interface Usuario {
    id: number;
    nombre?: string;
    apellido?: string;
    telefono?: number;
    correo: string;
    password_usuario: string;
  }

  export interface UsuarioInsert {
    nombre?: string;
    apellido?: string;
    telefono?: number;
    correo: string;
    password_usuario: string;
  }

  export interface UsuarioModify {
    nombre?: string;
    apellido?: string;
    telefono?: number;
  }

  export interface UsuarioPass {
    password_usuario?: string;
  }

  interface ServerResponse {
    success: boolean;
    message?: string;
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
  export const getPlatoByID = async (id: number): Promise<Plato> => {
    try {
      const response = await fetch(`${API_URL}/platos/${id}`);
      if (!response.ok) {
        throw new Error('Error al obtener el plato.');
      }
      const data = await response.json();
      return data as Plato;
    } catch (error) {
      throw new Error('Error al obtener el plato con el id');
    }
  };
  export const getPlatoRestauranteByID = async (id: number): Promise<Plato> => {
    try {
      const response = await fetch(`${API_URL}/platosRestaurante/${id}`);
      if (!response.ok) {
        throw new Error('Error al obtener los platos.');
      }
      const data = await response.json();
      return data as Plato;
    } catch (error) {
      throw new Error('Error al obtener los platos con el id');
    }
  };
  export const getUsuarioByEmail = async (email: string): Promise<Usuario> => {
    try {
      const response = await fetch(`${API_URL}/usuarios/${email}`);
      if (!response.ok) {
        throw new Error('Error al obtener los platos.');
      }
      const data = await response.json();
      return data as Usuario;
    } catch (error) {
      throw new Error('Error al obtener los platos con el id');
    }
  };
  

  export const editarPlato = async (id: number, nuevoPlato: Plato): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/platos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoPlato),
      });
      if (!response.ok) {
        throw new Error('Error al editar el plato.');
      }
    } catch (error) {
      throw new Error('Error al editar el plato.');
    }
  };
  export const insertarPlato = async ( nuevoPlato: PlatoInsert): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/platos/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoPlato),
      });
      if (!response.ok) {
        throw new Error('Error al INSERTAR el plato.');
      }
    } catch (error) {
      throw new Error('Error al INSERTAR el plato.');
    }
  };
  
  export const eliminarPlato = async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/platos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Error al eliminar el plato.');
      }
    } catch (error) {
      throw new Error('Error al eliminar el plato.');
    }
  };
  //Reservas
  export const crearReserva = async (reserva: ReservaInsert): Promise<ServerResponse> => {
    try {
      const response: AxiosResponse<ServerResponse> = await axios.post(`${API_URL}/reservas`, reserva);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error('Error al crear la reserva: ' + error.message);
      } else {
        throw error;
      }
    }
  };
  
  export const getReservas = async (): Promise<Reserva[]> => {
    try {
      const response: AxiosResponse<Reserva[]> = await axios.get(`${API_URL}/reservas`);
      return response.data;
    } catch (error:any) {
      throw new Error('Error al obtener las reservas: ' + error.message);
    }
  };
  export const eliminarReserva = async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/reservas/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Error al eliminar la reserva.');
      }
    } catch (error) {
      throw new Error('Error al eliminar la reserva.');
    }
  };
  
  export const insertarUsuario = async ( nuevoUsuario: UsuarioInsert): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/usuario/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoUsuario),
      });
      if (!response.ok) {
        throw new Error('Error al CREAR el usuario.');
      }
    } catch (error) {
      throw new Error('Error al CREAR el usuario.');
    }
  };

  export const editarUsuario = async ( id: number, nuevoUsuario: UsuarioModify): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/usuario/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoUsuario),
      });
      if (!response.ok) {
        throw new Error('Error al editar el usuario.');
      }
    } catch (error) {
      throw new Error('Error al editar el usuario.');
    }
  };

  export const actualizarContraseñaUsuario = async (id: number, nuevaPassword: UsuarioPass): Promise<void> => {
      try {
        const response = await fetch(`${API_URL}/usuarios/${id}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(nuevaPassword),
        });
        if (!response.ok) {
          throw new Error('Error al actualizar la contraseña del usuario.');
        }
      } catch (error) {
          throw new Error('Error al actualizar la contraseña del usuario.');
      }
  };

  export const eliminarUsuario = async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/usuarios/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Error al eliminar el usuario.');
      }
    } catch (error) {
      throw new Error('Error al eliminar el usuario.');
    }
  };

  export const obtenerIdUsuarioPorCorreo = async (correo: string) => {
    try {
        const response = await fetch(`${API_URL}/usuario/${correo}`);
        const data = await response.json();

        if (response.ok) {
            return data.id;
        } else {
            throw new Error('Error al obtener el ID del usuario 1.');
        }
    } catch (error) {
        throw new Error('Error al obtener el ID del usuario 2.');
    }
  };

  export const obtenerUsuarioPorId = async (id: number): Promise<Usuario> => {
    try {
      const response = await fetch(`${API_URL}/usuarios/${id}`);
      if (!response.ok) {
        throw new Error('Error al obtener el usuario.');
      }
      const usuario = await response.json();
      return Array.isArray(usuario) ? usuario[0] : usuario;
    } catch (error) {
      throw new Error('Error al obtener el usuario.');
    }
  };

  export const insertarRestaurante = async ( nuevoRestaurante: RestauranteInsert): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/restaurantes/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoRestaurante),
      });
      if (!response.ok) {
        throw new Error('Error al CREAR el restaurante.');
      }
    } catch (error) {
      throw new Error('Error al CREAR el restaurante.');
    }
  };

  export const verificarCorreo = async (correo: string): Promise<{ esRestaurante: boolean, esUsuario: boolean }> => {
    try {
      const response = await fetch(`${API_URL}/verificarCorreo/${correo}`);
      if (!response.ok) {
        throw new Error('Error al verificar el usuario');
      }
      return await response.json();
    } catch (error) {
      throw new Error('Error al verificar el usuario');
    }
  };


