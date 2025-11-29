# Captura de Requerimientos - Sistema IA para Comprensión de Textos Académicos

## 1. INFORMACIÓN GENERAL DEL PROYECTO

**Nombre del Proyecto:** Sistema Inteligente de Análisis y Comprensión de Textos Académicos (SIACTA)

**Objetivo:** Desarrollar una aplicación con interfaz gráfica que utilice inteligencia artificial para facilitar la comprensión, análisis y síntesis de textos académicos y papers científicos.

**Alcance:** Sistema desktop/web que permita cargar documentos académicos, procesarlos mediante IA y ofrecer herramientas de análisis, resumen y comprensión asistida.

---

## 2. REQUERIMIENTOS FUNCIONALES

### 2.1 Gestión de Documentos

**RF-01:** El sistema debe permitir la carga de documentos en formatos PDF, DOCX, TXT y EPUB.

**RF-02:** El sistema debe extraer y preservar la estructura del documento (título, abstract, secciones, referencias).

**RF-03:** El sistema debe mantener una biblioteca de documentos cargados con capacidad de búsqueda y filtrado.

**RF-04:** El sistema debe permitir la organización de documentos por categorías, etiquetas y proyectos.

**RF-05:** El sistema debe detectar automáticamente el idioma del documento.

### 2.2 Análisis y Comprensión con IA

**RF-06:** El sistema debe generar resúmenes automáticos en tres niveles: ejecutivo (100 palabras), estándar (300 palabras) y detallado (500+ palabras).

**RF-07:** El sistema debe identificar y extraer conceptos clave, términos técnicos y definiciones principales.

**RF-08:** El sistema debe responder preguntas específicas sobre el contenido del documento mediante procesamiento de lenguaje natural.

**RF-09:** El sistema debe explicar secciones complejas en lenguaje simplificado ajustable según nivel de expertise del usuario.

**RF-10:** El sistema debe identificar la metodología, resultados principales y conclusiones de papers de investigación.

**RF-11:** El sistema debe detectar y explicar relaciones entre diferentes secciones del documento.

**RF-12:** El sistema debe generar esquemas conceptuales y mapas mentales del contenido.

### 2.3 Herramientas de Estudio

**RF-13:** El sistema debe permitir hacer anotaciones y resaltados vinculados a secciones específicas.

**RF-14:** El sistema debe generar flashcards automáticas basadas en conceptos clave.

**RF-15:** El sistema debe crear guías de estudio personalizadas según objetivos del usuario.

**RF-16:** El sistema debe comparar múltiples documentos e identificar similitudes, diferencias y contradicciones.

**RF-17:** El sistema debe rastrear referencias cruzadas entre documentos de la biblioteca.

### 2.4 Exportación y Compartir

**RF-18:** El sistema debe exportar resúmenes, notas y análisis en formatos PDF, DOCX y Markdown.

**RF-19:** El sistema debe generar citas bibliográficas en formatos APA, MLA, Chicago e IEEE.

**RF-20:** El sistema debe permitir compartir análisis y anotaciones con otros usuarios.

---

## 3. REQUERIMIENTOS NO FUNCIONALES

### 3.1 Rendimiento

**RNF-01:** El procesamiento inicial de un documento de 50 páginas no debe exceder 30 segundos.

**RNF-02:** Las consultas a la IA deben responderse en menos de 5 segundos.

**RNF-03:** El sistema debe soportar documentos de hasta 500 páginas o 50MB.

**RNF-04:** El sistema debe manejar al menos 1000 documentos en la biblioteca sin degradación de rendimiento.

### 3.2 Usabilidad

**RNF-05:** La interfaz debe ser intuitiva, requiriendo menos de 10 minutos de capacitación para funciones básicas.

**RNF-06:** El sistema debe proporcionar feedback visual durante procesos largos (barras de progreso, indicadores).

**RNF-07:** La interfaz debe ser responsive y adaptarse a diferentes resoluciones de pantalla.

**RNF-08:** El sistema debe soportar temas claro y oscuro.

### 3.3 Seguridad y Privacidad

**RNF-09:** Los documentos del usuario deben almacenarse de forma encriptada localmente o en la nube.

**RNF-10:** El sistema debe cumplir con regulaciones de protección de datos (GDPR).

**RNF-11:** Las comunicaciones con servicios de IA externos deben usar conexiones seguras (HTTPS/TLS).

**RNF-12:** El usuario debe poder eliminar permanentemente sus datos.

### 3.4 Compatibilidad

**RNF-13:** El sistema debe funcionar en Windows 10+

**RNF-14:** Si es aplicación web, debe ser compatible con Chrome, Firefox, Safari y Edge (últimas 2 versiones).

**RNF-15:** El sistema debe funcionar offline para funciones básicas de lectura y anotación.

### 3.5 Escalabilidad

**RNF-16:** La arquitectura debe permitir la integración de nuevos modelos de IA sin refactorización mayor.

**RNF-17:** El sistema debe soportar plugins o extensiones futuras.

---

## 4. REQUERIMIENTOS DE INTERFAZ GRÁFICA

### 4.1 Componentes Principales

**RIG-01:** Dashboard principal con vista de biblioteca de documentos (cards o lista).

**RIG-02:** Visor de documentos con panel lateral para herramientas de IA.

**RIG-03:** Panel de chat/consultas a la IA con historial de conversación.

**RIG-04:** Sidebar de navegación con acceso a biblioteca, proyectos, configuración.

**RIG-05:** Toolbar con acciones rápidas (subir documento, buscar, exportar).

### 4.2 Funcionalidades de UI

**RIG-06:** Sistema de pestañas para trabajar con múltiples documentos simultáneamente.

**RIG-07:** Vista dividida para comparar documentos lado a lado.

**RIG-08:** Panel de resumen colapsable que muestra análisis principales.

**RIG-09:** Indicadores visuales de progreso de lectura y comprensión.

**RIG-10:** Sistema de notificaciones no intrusivo para procesos completados.

**RIG-11:** Menús contextuales al seleccionar texto (resumir, explicar, definir).

**RIG-12:** Búsqueda global con filtros avanzados y autocompletado.

### 4.3 Diseño Visual

**RIG-13:** Diseño limpio y minimalista que priorice la legibilidad.

**RIG-14:** Paleta de colores profesional con jerarquía visual clara.

**RIG-15:** Tipografía optimizada para lectura prolongada.

**RIG-16:** Iconografía consistente y reconocible.

**RIG-17:** Espaciado y layout que sigan principios de diseño material o fluent.

---

## 5. REQUERIMIENTOS TÉCNICOS

### 5.1 Stack Tecnológico Sugerido

**RT-01:** Frontend: React/Vue.js o Electron para aplicación desktop

**RT-02:** Backend: Python (FastAPI/Flask) o Node.js

**RT-03:** Base de datos: PostgreSQL o MongoDB para metadatos, SQLite para local

**RT-04:** Procesamiento IA: OpenAI API, Anthropic Claude API, o modelos open-source (Llama, Mistral)

**RT-05:** Procesamiento de documentos: PyPDF2, pdfplumber, python-docx, mammoth

**RT-06:** Vector database: Pinecone, Weaviate o ChromaDB para búsqueda semántica

### 5.2 Integraciones

**RT-07:** API de IA para procesamiento de lenguaje natural

**RT-08:** Servicios de OCR para documentos escaneados (Tesseract, Cloud Vision API)

**RT-09:** APIs de referencias bibliográficas (Crossref, Semantic Scholar)

**RT-10:** Almacenamiento en nube opcional (AWS S3, Google Cloud Storage, Dropbox)

---

## 6. CASOS DE USO PRINCIPALES

### CU-01: Análisis Rápido de Paper
**Actor:** Investigador  
**Flujo:**
1. Usuario carga un paper en PDF
2. Sistema extrae estructura y procesa contenido
3. Sistema genera resumen automático y conceptos clave
4. Usuario consulta sección específica para explicación detallada
5. Sistema proporciona explicación contextualizada

### CU-02: Preparación de Examen
**Actor:** Estudiante  
**Flujo:**
1. Usuario carga múltiples documentos del curso
2. Usuario solicita generación de guía de estudio
3. Sistema identifica temas principales y genera preguntas
4. Usuario practica con flashcards generadas
5. Sistema exporta material de estudio

### CU-03: Revisión de Literatura
**Actor:** Tesista  
**Flujo:**
1. Usuario organiza papers en proyecto de investigación
2. Usuario solicita comparación de metodologías
3. Sistema identifica patrones y diferencias
4. Usuario anota hallazgos importantes
5. Sistema genera tabla comparativa exportable

---

## 7. CRITERIOS DE ACEPTACIÓN

**CA-01:** El sistema procesa correctamente al menos el 95% de documentos académicos estándar.

**CA-02:** Los resúmenes generados capturan las ideas principales con precisión >85% (evaluación humana).

**CA-03:** El tiempo de respuesta de la IA es consistente <5 segundos en el 90% de consultas.

**CA-04:** La interfaz obtiene puntuación SUS (System Usability Scale) >80.

**CA-05:** Tasa de errores críticos <1% en operaciones principales.

---

## 8. RIESGOS Y MITIGACIONES

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Costos elevados de API de IA | Alta | Alto | Implementar caché inteligente, considerar modelos locales |
| Precisión insuficiente en extracción | Media | Alto | Múltiples librerías de parsing, validación humana |
| Documentos con formato complejo | Alta | Medio | Preprocesamiento robusto, manejo de excepciones |
| Tiempo de procesamiento excesivo | Media | Medio | Procesamiento asíncrono, optimización de prompts |
| Problemas de privacidad de datos | Media | Alto | Opción de procesamiento local, encriptación |

---

## 9. FASES DE DESARROLLO PROPUESTAS

### Fase 1 - MVP (8-10 semanas)
- Carga y visualización de documentos PDF
- Integración básica con API de IA
- Generación de resúmenes
- Interfaz básica con visor y panel de consultas

### Fase 2 - Funcionalidades Avanzadas (6-8 semanas)
- Biblioteca de documentos con búsqueda
- Anotaciones y resaltados
- Extracción de conceptos clave
- Comparación de documentos
- Sistema de proyectos

### Fase 3 - Optimización y Extras (4-6 semanas)
- Generación de flashcards y guías
- Exportación avanzada
- Mapas conceptuales
- Modo offline
- Temas y personalización

### Fase 4 - Pulido y Lanzamiento (3-4 semanas)
- Testing exhaustivo
- Optimización de rendimiento
- Documentación de usuario
- Preparación para despliegue

---

## 10. MÉTRICAS DE ÉXITO

- **Adopción:** 1000 usuarios activos en primeros 3 meses
- **Engagement:** Promedio 30 minutos por sesión
- **Retención:** >60% retención a 30 días
- **Satisfacción:** NPS (Net Promoter Score) >50
- **Funcionalidad:** >10 documentos procesados por usuario/mes

---

## 11. ANEXOS

### Mockups y Wireframes
(A desarrollar en fase de diseño)

### Glosario de Términos
- **Paper:** Artículo académico de investigación
- **Abstract:** Resumen ejecutivo de un paper
- **Vector Database:** Base de datos optimizada para búsqueda semántica
- **NLP:** Natural Language Processing (Procesamiento de Lenguaje Natural)

### Referencias
- Estándares de accesibilidad WCAG 2.1
- Mejores prácticas de UI/UX para aplicaciones educativas
- Documentación de APIs de IA a utilizar

---

**Documento preparado por:** Equipo de Desarrollo  
**Fecha:** 28 de noviembre de 2025  
**Versión:** 1.0  
**Estado:** Borrador para revisión

---

# ESTRUCTURA DEL PROYECTO

```
SIACTA/
│
├── frontend/                          # Aplicación cliente
│   ├── public/
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   └── assets/
│   │       ├── icons/
│   │       └── images/
│   │
│   ├── src/
│   │   ├── App.jsx                   # Componente raíz
│   │   ├── main.jsx                  # Punto de entrada
│   │   │
│   │   ├── components/               # Componentes reutilizables
│   │   │   ├── common/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Loader.jsx
│   │   │   │   ├── SearchBar.jsx
│   │   │   │   └── NotificationToast.jsx
│   │   │   │
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Header.jsx
│   │   │   │   └── Footer.jsx
│   │   │   │
│   │   │   ├── document/
│   │   │   │   ├── DocumentViewer.jsx
│   │   │   │   ├── DocumentCard.jsx
│   │   │   │   ├── DocumentUpload.jsx
│   │   │   │   ├── PDFRenderer.jsx
│   │   │   │   └── AnnotationPanel.jsx
│   │   │   │
│   │   │   ├── library/
│   │   │   │   ├── LibraryGrid.jsx
│   │   │   │   ├── LibraryList.jsx
│   │   │   │   ├── FilterPanel.jsx
│   │   │   │   └── CategoryManager.jsx
│   │   │   │
│   │   │   └── ai/
│   │   │       ├── ChatPanel.jsx
│   │   │       ├── SummaryCard.jsx
│   │   │       ├── ConceptExtractor.jsx
│   │   │       ├── QuestionInterface.jsx
│   │   │       └── ComparisonView.jsx
│   │   │
│   │   ├── pages/                    # Vistas principales
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Library.jsx
│   │   │   ├── DocumentDetail.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── StudyGuide.jsx
│   │   │   ├── Compare.jsx
│   │   │   └── Settings.jsx
│   │   │
│   │   ├── hooks/                    # Custom hooks
│   │   │   ├── useDocuments.js
│   │   │   ├── useAI.js
│   │   │   ├── useAnnotations.js
│   │   │   ├── useSearch.js
│   │   │   └── useAuth.js
│   │   │
│   │   ├── services/                 # Servicios API
│   │   │   ├── api.js               # Configuración base Axios
│   │   │   ├── documentService.js
│   │   │   ├── aiService.js
│   │   │   ├── userService.js
│   │   │   └── storageService.js
│   │   │
│   │   ├── store/                    # Estado global (Redux/Zustand)
│   │   │   ├── index.js
│   │   │   ├── slices/
│   │   │   │   ├── documentSlice.js
│   │   │   │   ├── userSlice.js
│   │   │   │   ├── uiSlice.js
│   │   │   │   └── projectSlice.js
│   │   │   └── middleware/
│   │   │       └── apiMiddleware.js
│   │   │
│   │   ├── utils/                    # Utilidades
│   │   │   ├── constants.js
│   │   │   ├── formatters.js
│   │   │   ├── validators.js
│   │   │   ├── pdfUtils.js
│   │   │   └── exportUtils.js
│   │   │
│   │   ├── styles/                   # Estilos
│   │   │   ├── global.css
│   │   │   ├── variables.css
│   │   │   ├── themes/
│   │   │   │   ├── light.css
│   │   │   │   └── dark.css
│   │   │   └── components/
│   │   │
│   │   └── types/                    # TypeScript types (si aplica)
│   │       ├── document.types.ts
│   │       ├── ai.types.ts
│   │       └── user.types.ts
│   │
│   ├── package.json
│   ├── vite.config.js               # o webpack.config.js
│   ├── .env.example
│   └── .eslintrc.js
│
├── backend/                          # Servidor API
│   ├── src/
│   │   ├── app.py                   # Punto de entrada
│   │   ├── config.py                # Configuración
│   │   │
│   │   ├── api/                     # Endpoints
│   │   │   ├── __init__.py
│   │   │   ├── routes/
│   │   │   │   ├── documents.py
│   │   │   │   ├── ai.py
│   │   │   │   ├── users.py
│   │   │   │   ├── projects.py
│   │   │   │   └── annotations.py
│   │   │   │
│   │   │   └── middlewares/
│   │   │       ├── auth.py
│   │   │       ├── error_handler.py
│   │   │       └── rate_limiter.py
│   │   │
│   │   ├── services/                # Lógica de negocio
│   │   │   ├── __init__.py
│   │   │   ├── document_processor.py
│   │   │   ├── ai_service.py
│   │   │   ├── vector_store.py
│   │   │   ├── ocr_service.py
│   │   │   ├── summary_generator.py
│   │   │   └── comparison_engine.py
│   │   │
│   │   ├── models/                  # Modelos de datos
│   │   │   ├── __init__.py
│   │   │   ├── document.py
│   │   │   ├── user.py
│   │   │   ├── project.py
│   │   │   ├── annotation.py
│   │   │   └── summary.py
│   │   │
│   │   ├── db/                      # Base de datos
│   │   │   ├── __init__.py
│   │   │   ├── connection.py
│   │   │   ├── migrations/
│   │   │   └── repositories/
│   │   │       ├── document_repo.py
│   │   │       ├── user_repo.py
│   │   │       └── project_repo.py
│   │   │
│   │   ├── ai/                      # Módulos de IA
│   │   │   ├── __init__.py
│   │   │   ├── prompts/
│   │   │   │   ├── summary_prompts.py
│   │   │   │   ├── explanation_prompts.py
│   │   │   │   └── comparison_prompts.py
│   │   │   │
│   │   │   ├── processors/
│   │   │   │   ├── text_splitter.py
│   │   │   │   ├── embeddings.py
│   │   │   │   └── semantic_search.py
│   │   │   │
│   │   │   └── clients/
│   │   │       ├── openai_client.py
│   │   │       ├── claude_client.py
│   │   │       └── local_model.py
│   │   │
│   │   ├── parsers/                 # Parsers de documentos
│   │   │   ├── __init__.py
│   │   │   ├── pdf_parser.py
│   │   │   ├── docx_parser.py
│   │   │   ├── txt_parser.py
│   │   │   └── structure_extractor.py
│   │   │
│   │   └── utils/                   # Utilidades
│   │       ├── __init__.py
│   │       ├── logger.py
│   │       ├── validators.py
│   │       ├── file_handler.py
│   │       └── cache.py
│   │
│   ├── tests/                       # Tests unitarios
│   │   ├── __init__.py
│   │   ├── test_documents.py
│   │   ├── test_ai_service.py
│   │   ├── test_parsers.py
│   │   └── fixtures/
│   │
│   ├── requirements.txt
│   ├── requirements-dev.txt
│   ├── .env.example
│   └── Dockerfile
│
├── ai_models/                       # Modelos locales (opcional)
│   ├── embeddings/
│   ├── summarization/
│   └── model_configs/
│
├── storage/                         # Almacenamiento local
│   ├── documents/                   # PDFs y archivos subidos
│   ├── processed/                   # Documentos procesados
│   ├── cache/                       # Cache de respuestas IA
│   └── exports/                     # Archivos exportados
│
├── database/                        # Archivos de BD
│   ├── migrations/
│   └── seeds/
│
├── docs/                           # Documentación
│   ├── API.md
│   ├── ARCHITECTURE.md
│   ├── USER_GUIDE.md
│   ├── DEPLOYMENT.md
│   └── images/
│       ├── architecture-diagram.png
│       └── ui-mockups/
│
├── scripts/                        # Scripts de utilidad
│   ├── setup.sh
│   ├── migrate.py
│   ├── seed_data.py
│   └── backup.sh
│
├── .github/                        # GitHub Actions
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
│
├── docker-compose.yml              # Orquestación de contenedores
├── .gitignore
├── README.md
├── LICENSE
└── CONTRIBUTING.md
```