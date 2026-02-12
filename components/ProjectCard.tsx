
import React from 'react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col h-full hover:-translate-y-1">
      <div className="relative overflow-hidden aspect-video">
        <img 
          src={project.imageUrl} 
          alt={project.title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        {/* Label hanya muncul jika project.category memiliki isi */}
        {project.category && (
          <div className="absolute top-4 left-4">
            <span className="bg-yellow-400 text-black text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
              {project.category}
            </span>
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors">
          {project.title}
        </h3>
        <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-grow leading-relaxed">
          {project.description}
        </p>
        <a 
          href={project.externalUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full bg-black text-yellow-400 hover:bg-yellow-400 hover:text-black font-bold py-3 rounded-xl text-center transition-all duration-300 flex items-center justify-center space-x-2 shadow-md"
        >
          <span>Buka Aplikasi</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default ProjectCard;
