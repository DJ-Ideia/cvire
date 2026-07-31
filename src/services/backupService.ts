import { db } from '../db/cvDatabase';
import { CVProfile } from '../types/cv';
import { useCVStore } from '../store/useCVStore';

/**
 * Export all resumes stored in IndexedDB into a single formatted JSON backup file.
 */
export async function exportAllResumesJSON(): Promise<void> {
  const profiles = await db.profiles.toArray();
  if (!profiles || profiles.length === 0) {
    alert('No resumes found to export.');
    return;
  }

  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `cvire-backup-${dateStr}.json`;

  const jsonStr = JSON.stringify(profiles, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export a single resume profile into a formatted JSON file.
 */
export function exportSingleResumeJSON(profile: CVProfile): void {
  const cleanTitle = (profile.title || 'resume').toLowerCase().replace(/\s+/g, '-');
  const filename = `${cleanTitle}.json`;

  const jsonStr = JSON.stringify([profile], null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export a clean JSON Schema template pre-formatted for AI fill-out (ChatGPT/Claude/Gemini).
 */
export function downloadAITemplateJSON(): void {
  const sampleTemplate = [
    {
      id: "cv-template-ai",
      title: "Seu Nome - Cargo Desejado",
      language: "pt-BR",
      isFavorite: false,
      isArchived: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      templateId: "modern-tech",
      personal: {
        fullName: "Seu Nome Completo",
        jobTitle: "Cargo Profissional (ex: Engenheiro de Dados)",
        email: "seu.email@exemplo.com",
        phone: "+55 11 99999-9999",
        location: "Cidade, Estado, Brasil",
        linkedinUrl: "linkedin.com/in/seu-perfil",
        portfolioUrl: "github.com/seu-usuario",
        photoFormat: "hidden"
      },
      summary: "Escreva aqui um resumo profissional de 3 a 4 linhas destacando seus principais resultados, tecnologias e anos de experiência.",
      sectionsOrder: ["experience", "skills", "education", "projects", "languages", "certifications"],
      sections: {
        experience: {
          id: "experience",
          type: "experience",
          title: "Experiência Profissional",
          column: "main",
          visible: true,
          displayMode: "bullets",
          items: [
            {
              id: "exp-1",
              title: "Nome do Cargo",
              subtitle: "Nome da Empresa",
              location: "Remoto / Cidade",
              startDate: "Mai 2023",
              endDate: "Presente",
              current: true,
              bulletItems: [
                {
                  id: "b-1",
                  text: "Descreva uma conquista quantificável usando ação + métrica + tecnologia (ex: Otimizou consulta SQL reduzindo tempo em 50%).",
                  enabled: true,
                  isMetricHighlighted: true
                }
              ]
            }
          ]
        },
        skills: {
          id: "skills",
          type: "skills",
          title: "Habilidades Técnicas",
          column: "sidebar",
          visible: true,
          displayMode: "tags",
          items: [
            {
              id: "sk-1",
              title: "Linguagens & Tecnologias",
              tags: ["Python", "SQL", "GCP", "PostgreSQL", "Docker"]
            }
          ]
        },
        education: {
          id: "education",
          type: "education",
          title: "Educação",
          column: "main",
          visible: true,
          displayMode: "compact",
          items: [
            {
              id: "edu-1",
              title: "Bacharelado / Graduação em Sua Área",
              subtitle: "Nome da Universidade ou Faculdade",
              startDate: "2020",
              endDate: "2024"
            }
          ]
        }
      },
      theme: {
        primaryColor: "#2563eb",
        accentColor: "#3b82f6",
        textColor: "#1e293b",
        backgroundColor: "#ffffff",
        fontFamily: "Inter",
        fontSizeScale: "md",
        lineHeight: 1.45,
        columnGap: 24,
        sectionSpacing: "normal",
        pageMargins: "normal",
        borderRadius: 8,
        headerStyle: "classic",
        dividerStyle: "solid",
        bulletStyle: "disc",
        textAlignment: "left"
      }
    }
  ];

  const jsonStr = JSON.stringify(sampleTemplate, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'modelo-curriculo-cvire-ia.json';
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Import resumes from an uploaded JSON file and merge them into IndexedDB.
 */
export async function importResumesJSON(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        if (!text) {
          throw new Error('File content is empty.');
        }

        const parsed = JSON.parse(text);
        let profilesToImport: CVProfile[] = [];

        if (Array.isArray(parsed)) {
          profilesToImport = parsed;
        } else if (parsed && typeof parsed === 'object' && parsed.id) {
          profilesToImport = [parsed as CVProfile];
        } else {
          throw new Error('Invalid JSON format: Expected a single resume or an array of resumes.');
        }

        // Validate basic profile structure
        const validProfiles = profilesToImport.filter(
          (p) => p && typeof p === 'object' && p.id && p.personal
        );

        if (validProfiles.length === 0) {
          throw new Error('No valid cvire resumes found in the JSON file.');
        }

        // Save into Dexie IndexedDB & update store
        const { importProfiles } = useCVStore.getState();
        await importProfiles(validProfiles);

        resolve(validProfiles.length);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read the file.'));
    reader.readAsText(file);
  });
}
