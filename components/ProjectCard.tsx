
import React, { useState } from 'react';
import { Project } from '../types';
import { useNavigate } from 'react-router-dom';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();

  const fallbackImage = "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=600&auto=format&fit=crop";

  const handleAction = (e: React.MouseEvent) => {
    if (project.actionType === 'internal') {
      e.preventDefault();
      navigate(`/project/${project.id}`);
    }
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col h-full hover:-translate-y-1">
      <div className="relative overflow-hidden aspect-video bg-gray-50 flex items-center justify-center">
        {!imgError ? (
          <img 
            src={project.imageUrl || fallbackImage} 
            alt={project.title} 
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-yellow-50 flex flex-col items-center justify-center p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-[10px] font-black text-yellow-600 uppercase tracking-tighter">Gambar Tidak Tersedia</span>
          </div>
        )}
        
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
          href={project.actionType === 'internal' ? '#' : project.externalUrl}
          onClick={handleAction}
          target={project.actionType === 'internal' ? undefined : "_blank"}
          rel={project.actionType === 'internal' ? undefined : "noopener noreferrer"}
          className="w-full bg-black text-yellow-400 hover:bg-yellow-400 hover:text-black font-bold py-3 rounded-xl text-center transition-all duration-300 flex items-center justify-center space-x-2 shadow-md"
        >
          <span>{project.actionType === 'internal' ? 'Lihat Detail' : 'Buka Aplikasi'}</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default ProjectCard;