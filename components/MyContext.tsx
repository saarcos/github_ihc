import React, { createContext, useContext, useState, useEffect } from 'react';

interface Restaurante {
    id: number;
    titulo: string;
    imagen: string[];
    direccion: string;
    informacion_restaurante: {
      nombre: string;
      direccion: string;
      menu: {
        nombre: string;
        precio: number;
        foto: string;
      }[];
    };
  }
  
  interface MyContextType {
    restaurantes: Restaurante[];
    id: string | null;
    setId: (id: string | null) => void;
  }
const MyContext = createContext<MyContextType | undefined>(undefined);

export const useMyContext = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useMyContext debe ser usado dentro de un MyContextProvider');
  }
  return context;
};

interface MyContextProviderProps {
  children: React.ReactNode; 
}

export const MyContextProvider: React.FC<MyContextProviderProps> = ({ children }) => {
  const [id, setId] = useState<string | null>(null);
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const response = await require('./Restaurantes.json');
        setRestaurantes(response);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };
    cargarDatos();
  }, []);


  return (
    <MyContext.Provider value={{ id, setId , restaurantes }}>
      {children}
    </MyContext.Provider>
  );
};