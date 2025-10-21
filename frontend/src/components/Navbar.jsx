// frontend/src/components/Navbar.jsx (REVISADO PARA ELEGÂNCIA)

import React from 'react';

export default function Navbar({ activeTab, setActiveTab }) {

    const tabClasses = (tabName) => 
        `px-4 py-3 font-semibold text-sm transition-all duration-300 cursor-pointer 
         whitespace-nowrap 
         ${activeTab === tabName 
            // Aba Ativa: Fundo escuro e sublinhado Azul/Ciano
            ? 'bg-gray-800 text-cyan-400 border-b-2 border-cyan-400' 
            // Aba Inativa: Texto cinza suave
            : 'text-gray-400 hover:text-cyan-400 hover:bg-gray-700/50'}`; // Fundo escuro sutil no hover

    return (
        // Navbar: Fundo muito escuro com sombra suave
        <nav className="bg-gray-900 shadow-xl sticky top-0 z-20"> 
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col">
                    
                    {/* Cabeçalho Principal (Título) */}
                    <div className="py-4 text-center">
                        {/* Título com cor de destaque e sombra de texto sutil */}
                        <h1 className="text-3xl font-extrabold text-cyan-400 tracking-wider">FlixBytes</h1>
                        <p className="text-sm text-gray-500 mt-1">Filmes que vi, quero ver e minhas avaliações</p>
                    </div>
                </div>
            </div>
        </nav>
    );
}