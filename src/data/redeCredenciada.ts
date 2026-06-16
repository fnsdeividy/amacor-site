/**
 * Dados da Rede Credenciada AMACOR SAÚDE / MHVIDA
 * Documento: REDE CREDENCIADA - RIO DE JANEIRO JUNHO 2026
 * Registro ANS: nº 41201-5
 */

export interface CredentialedProvider {
  id: string;
  name: string;
  type: 'pronto-atendimento' | 'clinica' | 'laboratorio' | 'hospital-dia' | 'medicina-nuclear' | 'reabilitacao' | 'oftalmologia' | 'ortopedia' | 'radiologia' | 'oncologia';
  address: string;
  phones: string[];
  whatsapp?: string;
  hours?: string;
  specialties: string[];
  exams: string[];
}

export const redeCredenciada: CredentialedProvider[] = [
  {
    id: 'rc-001',
    name: 'Clínica Amacor Serviços Médicos',
    type: 'clinica',
    address: 'Rua Augusto de Vasconcelos, 535 - Campo Grande - RJ',
    phones: ['(21) 3405-9494'],
    hours: 'Segunda a Sábado das 07:00h às 13:00h',
    specialties: [
      'Angiologia', 'Urologia', 'Cardiologia', 'Ortopedia', 'Pediatria',
      'Pneumologia', 'Clínica Médica', 'Geriatria', 'Dermatologia',
      'Reumatologia', 'Endocrinologista', 'Neurologia', 'Gastroenterologia',
      'Ginecologia', 'Psiquiatria'
    ],
    exams: [
      'Análises Clínicas', 'Endoscopia Digestiva', 'Prova de Função Respiratória',
      'Procedimentos Dermatológicos Ambulatoriais', 'Doppler de Carótidas e Vertebrais',
      'Holter 24h', 'Doppler Vascular', 'Ultrassonografias', 'Doppler Artérias Renais',
      'Mapa 24h', 'Doppler Ilíacas', 'Preventivo', 'Doppler Aorta Abdominal',
      'Colonoscopia Ambulatorial', 'Ecocardiograma', 'Eletrocardiograma',
      'Doppler Venoso e Arterial'
    ]
  },
  {
    id: 'rc-002',
    name: 'Hospital de Clínicas São Matheus',
    type: 'pronto-atendimento',
    address: 'Rua Silva Cardoso, 689 - Bangu - RJ',
    phones: ['2401-7396', '3291-0494'],
    hours: 'Urgência/Emergência 24h (Clínica Médica e Pediatria) | Ortopedia: 07:00h às 18:00h',
    specialties: ['Clínica Médica', 'Pediatria', 'Ortopedia'],
    exams: []
  },
  {
    id: 'rc-003',
    name: 'CEMEG Guaratiba',
    type: 'pronto-atendimento',
    address: 'Rua Águas Formosas, 398 - Guaratiba - RJ',
    phones: ['(21) 3420-3141', '3802-9490', '3490-2220'],
    whatsapp: '2196747-3702',
    hours: 'Segunda a Sábado das 07h às 19h | Domingo das 08h às 15h',
    specialties: [
      'Nutrição', 'Neurologia', 'Angiologia', 'Ortopedia', 'Cardiologia',
      'Oftalmologia', 'Clínica Médica', 'Psicologia', 'Cirurgia Geral',
      'Pediatria', 'Dermatologia', 'Proctologia', 'Endocrinologia',
      'Urologia', 'Fonoaudiologia', 'Geriatria', 'Gastroenterologia',
      'Ginecologia', 'Obstetrícia'
    ],
    exams: [
      'Audiometria', 'Procedimentos Dermatológicos', 'Dopplerfluxometria Colorido',
      'Mamografia Digital', 'Densitometria Óssea', 'Mapa 24h', 'Doppler em Geral',
      'Teste Alérgico', 'Eletroencefalograma com Mapeamento Cerebral', 'Preventivo',
      'Endoscopia Digestiva', 'Procedimentos Ortopédicos', 'Vídeo-Laringoscopia',
      'Raio X Digital', 'Ecocardiograma Colorido', 'Teste de Orelhinha',
      'Escanometria', 'Teste de Contato', 'Eletrocardiograma', 'Teste Ergométrico',
      'Fisioterapia', 'Teste de Sobrecarga Hídrica', 'Impedanciometria', 'Ultrassonografia'
    ]
  },
  {
    id: 'rc-004',
    name: 'Clínicas Reunidas São Victor',
    type: 'clinica',
    address: 'Rua Carvalho Alvim, 261 - Tijuca - RJ',
    phones: ['(21) 2142-7150', '2142-7171'],
    hours: 'Segunda a Sexta-feira das 07h às 18h',
    specialties: [
      'Alergologia', 'Mastologia', 'Angiologia', 'Cirurgia Vascular', 'Neurologia',
      'Cardiologia', 'Nutrição', 'Psicologia', 'Cirurgia Geral', 'Oftalmologia',
      'Clínica Médica', 'Ortopedia', 'Dermatologia', 'Otorrinolaringologia',
      'Endocrinologia', 'Pneumologia', 'Psiquiatria', 'Proctologista',
      'Gastroenterologia', 'Urologia', 'Homeopatia', 'Pediatria',
      'Ginecologia', 'Obstetrícia', 'Reumatologia'
    ],
    exams: [
      'Audiometria', 'Peniscopia', 'Anuscopia', 'Procedimentos de Otorrinolaringologia',
      'Densitometria Óssea', 'Procedimentos de Dermatologia', 'Exames Laboratoriais',
      'Procedimentos de Ortopedia', 'Ecocardiograma', 'Endoscopia Digestiva',
      'Eletrocardiograma', 'Eletroencefalograma com Mapeamento Cerebral',
      'Função Respiratória - Espirometria', 'Holter 24h', 'Mapa 24h',
      'Mamografia Digital', 'Procedimentos de Urologia', 'Radiologia Geral',
      'Teste Ergométrico', 'Testes Vestibulares', 'Ultrassonografia',
      'Vectoeletronistagmografia', 'Colonoscopia', 'Vídeo Endoscopia Nasal',
      'Vídeo Laringoscopia', 'Acupuntura', 'Fisioterapia'
    ]
  },
  {
    id: 'rc-005',
    name: 'Clínica de Diagnóstico Khayat',
    type: 'clinica',
    address: 'Rua Francisco Real, 747 - Padre Miguel - RJ',
    phones: ['(21) 3159-8717', '2401-9095'],
    specialties: [],
    exams: [
      'Densitometria Óssea', 'Ultrassonografias', 'Mamografia Digital',
      'Prova de Função Pulmonar', 'Ecocardiograma', 'Eletrocardiograma',
      'Eletroencefalograma'
    ]
  },
  {
    id: 'rc-006',
    name: 'Urofield Urologia Humanizada',
    type: 'clinica',
    address: 'Rua Augusto de Vasconcelos, nº 544 - Sala 334 - Campo Grande - RJ (Pátio Campo Grande)',
    phones: ['(22) 2442-6727'],
    whatsapp: '(22) 98248-1571',
    specialties: ['Urologia'],
    exams: ['Urodinâmica Completa', 'Urofluxometria', 'Cistoscopia', 'Uretroscopia']
  },
  {
    id: 'rc-007',
    name: 'COR - Centro Oftalmológico de Realengo',
    type: 'oftalmologia',
    address: 'Estrada da Água Branca, 2369 - Realengo - RJ',
    phones: ['2401-1721', '2401-9912', '3332-2511'],
    specialties: ['Oftalmologia Adulto', 'Oftalmologia Infantil', 'Retina', 'Glaucoma', 'Estrabismo', 'Córnea'],
    exams: [
      'OCT-Tomografia de Coerência Óptica', 'Microscopia Especular da Córnea',
      'Campimetria Computadorizada', 'Potencial de Acuidade Visual a Laser (PAM)',
      'Curva Tensional Diária', 'Pterígio Ambulatorial', 'Ceratoscopia (Topografia)',
      'Calázio Ambulatorial', 'Exercícios de Pleóptica', 'Capsulotomia',
      'Exercícios de Ortóptica', 'Sondagem das Vias Lacrimais', 'Epilação',
      'Teste de Sensibilidade de Contraste ou de Cores', 'Fotocoagulação a Laser',
      'Teste Provocativo para Glaucoma', 'Fundoscopia sob Midríase',
      'Teste Ortóptico (Exame de Motilidade Ocular)',
      'Facectomia (Catarata) Ambulatorial', 'Tratamento Ocular Quimioterápico Ambulatorial',
      'Gonioscopia', 'Teste do Reflexo Vermelho', 'Iridectomia / Iridotomia',
      'Visão Subnormal', 'Iridotomia a Laser', 'Biometria Ultrassônica',
      'Mapeamento de Retina', 'Ultrassonografia Ocular', 'Paquimetria Ultrassônica',
      'Retinografia Fluorescente', 'Fundoscopia sob Midríase', 'Recobrimento Conjuntival'
    ]
  },
  {
    id: 'rc-008',
    name: 'SOTRE - Fisiotrauma - Ortopedia e Fisioterapia',
    type: 'ortopedia',
    address: 'Rua Silva Cardoso, nº 515 - Bangu - RJ',
    phones: ['3421-2030', '2301-7726', '3421-2288', '3337-2150'],
    whatsapp: '96449-8583',
    hours: 'Segunda a Sexta: 08h às 18h | Sábado: 08h às 12h',
    specialties: ['Ortopedia'],
    exams: ['Gesso', 'Acupuntura', 'Raio X', 'Fisioterapia']
  },
  {
    id: 'rc-009',
    name: 'ASM Saúde Visual',
    type: 'oftalmologia',
    address: 'Rua Francisco Real, 1950 - Sala 126 - Bangu - RJ (Shopping Real Bangu)',
    phones: ['(21) 2401-5451'],
    whatsapp: '(21) 97150-5451',
    specialties: ['Oftalmologia Adulto', 'Oftalmologia Pediátrica'],
    exams: [
      'Consulta / Tonometria', 'Microscopia Especular', 'Paquimetria',
      'Curva Tensional Diária', 'Retirada de Corpo Estranho',
      'Mapeamento de Retina', 'Teste do Reflexo Vermelho',
      'PAM-Acuidade Visual Potencial', 'Teste Provocativo para Glaucoma'
    ]
  },
  {
    id: 'rc-010',
    name: 'Centro Médico Itanhangá',
    type: 'clinica',
    address: 'Estrada do Itanhangá, 1.103 - Itanhangá - RJ',
    phones: ['(21) 3154-3050'],
    specialties: [
      'Alergologia', 'Nutrição', 'Angiologia', 'Neuro Pediatria', 'Cardiologia',
      'Oftalmologia', 'Clínica Médica', 'Ortopedia', 'Dermatologia',
      'Otorrinolaringologia', 'Endocrinologia', 'Psicologia', 'Fonoaudiologia',
      'Pediatria', 'Gastroenterologia', 'Psiquiatria', 'Neurologia', 'Urologia',
      'Ginecologia', 'Pneumologia'
    ],
    exams: [
      'Acupuntura', 'Microscopia Especular da Córnea', 'Análises Clínicas',
      'Mamografia', 'Audiometria', 'Mapeamento de Retina', 'Ceratoscopia (Topografia)',
      'Paquimetria', 'Curva Tensional', 'Preventivo', 'Densitometria Óssea',
      'Procedimentos Dermatológicos Ambulatorial', 'Doppler de Carótidas e Vertebrais',
      'Potencial de Acuidade Visual', 'Doppler Venoso e Arterial', 'Retirada de Cerume',
      'Eletrocardiograma', 'Raios X', 'Eletroencefalograma Convencional',
      'Retirada de Corpo Estranho', 'Ecocardiograma', 'Tonometria de Aplanação',
      'Eletroencefalograma com Mapeamento Cerebral', 'Teste Ergométrico',
      'Fundoscopia', 'Teste Alérgico', 'Fisioterapia', 'Ultrassonografia',
      'Gonioscopia', 'Vídeo-Faringo-Laringoscopia', 'Holter 24h',
      'Vídeo Laringoscopia', 'Impedanciometria', 'Vídeo Endoscopia Digestiva',
      'Mapa 24h'
    ]
  },
  {
    id: 'rc-011',
    name: 'Clínica Reabilitar / Fisio Fiaes',
    type: 'reabilitacao',
    address: 'Edifício West Medical Center - Rua Ivo do Prado, nº 79 - Sala 410 - Campo Grande - RJ',
    phones: ['21-3649-4204', '96437-0154', '3649-4209'],
    specialties: ['Fonoaudiologia', 'Nutrição', 'Psicologia'],
    exams: ['Acupuntura', 'Fisioterapia']
  },
  {
    id: 'rc-012',
    name: 'CEMOL - Centro de Especialidades Médicas Vila Valqueire',
    type: 'clinica',
    address: 'Rua Luiz Beltrão, 424 - Vila Valqueire - RJ',
    phones: ['2453-2932', '2454-9119'],
    specialties: ['Cardiologia', 'Mastologia', 'Clínica Médica', 'Obstetrícia', 'Ginecologia'],
    exams: [
      'Colposcopia com Biopsia', 'Exames Laboratoriais', 'Ecocardiograma',
      'Eletrocardiograma', 'Acupuntura', 'Fisioterapia'
    ]
  },
  {
    id: 'rc-013',
    name: 'Oftalmoclínica Bangu',
    type: 'oftalmologia',
    address: 'Avenida Cônego de Vasconcelos, 423 - Sala 301 a 311 - Bangu - RJ',
    phones: ['2401-3889', '2402-5162', '2401-2014'],
    specialties: ['Oftalmologia Adulto', 'Oftalmologia Infantil'],
    exams: [
      'Acuidade Visual a Laser (PAM)', 'Mapeamento de Retina', 'Biometria Ultrassônica',
      'Microscopia Especular da Córnea', 'Campimetria Computadorizada',
      'OCT-Tomografia de Coerência Óptica', 'Capsulotomia com Yag Laser',
      'Paquimetria Ultrassônica', 'Curva Tensional Diária', 'Remoção de Corpo Estranho',
      'Gonioscopia', 'Tonometria de Aplanação', 'Iridotomia a Laser',
      'Ultrassonografia Ocular'
    ]
  },
  {
    id: 'rc-014',
    name: 'Clínica Polisaude',
    type: 'clinica',
    address: 'Avenida Cesário de Melo, 2855 - Sala 501 - Campo Grande - RJ (Edifício Montblanc Towers)',
    phones: ['(21) 3394-1963'],
    specialties: ['NeuroPediatria', 'Ginecologia', 'Neurologia', 'Psicologia'],
    exams: []
  },
  {
    id: 'rc-015',
    name: 'Clínica do Sono - Unidade Bangu',
    type: 'clinica',
    address: 'Rua Silva Cardoso, 125 - Salas 218 e 318 - Bangu - RJ (Calçadão de Bangu)',
    phones: ['3338-7350', '3332-5838', '98921-3522', '4063-9311'],
    specialties: ['Endocrinologia'],
    exams: [
      'Ecocardiograma com Doppler', 'Prova de Função Pulmonar', 'Holter 24h',
      'P-300', 'Mapa 24h', 'Registro do Nistagmo Optocinético', 'Potencial Evocado',
      'Testes Vestibulares com Eletronistagmografia',
      'Testes Vestibulares sem Eletronistagmografia', 'Ultrassonografia',
      'Teste da Orelhinha (Otoemissão)', 'Eletroneuomiografia',
      'Pesquisa de Nistagmo Pendular', 'Eletroencefalograma com Mapeamento',
      'Eletrocardiograma', 'Pesquisa de Pares Cranianos'
    ]
  },
  {
    id: 'rc-016',
    name: 'Clínica do Sono - Unidade Copacabana',
    type: 'clinica',
    address: 'Avenida Nossa Senhora de Copacabana, 895 - Sala 1.201 - Copacabana - RJ',
    phones: ['2523-4708', '2267-2576'],
    specialties: [],
    exams: ['Ecocardiograma com Doppler', 'Eletroneuromiografia', 'Ultrassonografia']
  },
  {
    id: 'rc-017',
    name: 'Fisiomed Clínica de Assistência Médica',
    type: 'reabilitacao',
    address: 'Rua Severiano das Chagas, 154 - Santa Cruz - RJ (Praça Marquês de Herval)',
    phones: ['(21) 3305-2392', '2051-7825', '2051-7876'],
    specialties: ['Endocrinologia', 'Nutrição', 'Fonoaudiologia', 'Pediatria', 'Psicomotricidade'],
    exams: [
      'Acupuntura', 'Fisioterapia Neurológica', 'Fisioterapia Ambulatorial',
      'Fisioterapia de Reabilitação Cardiovascular',
      'Fisioterapia para Distúrbio Temporo Mandibular (ATM)',
      'Fisioterapia Respiratória no Pré e Pós Operatório',
      'Fisioterapia Uroginecológica', 'Fisioterapia para Reabilitação Labiríntica',
      'Fisioterapia Respiratória Adulto e Infantil', 'Fisioterapia Pélvica'
    ]
  },
  {
    id: 'rc-018',
    name: 'BBL Serviços em Reabilitação',
    type: 'reabilitacao',
    address: 'Avenida Ministro Ary Franco, 401 - Grupo 2 - Bangu - RJ (Calçadão de Bangu)',
    phones: ['3518-8384'],
    specialties: ['Fonoaudiologia', 'Psicologia', 'Nutrição', 'Terapia Ocupacional'],
    exams: ['Teste da Orelhinha (Otoemissão)']
  },
  {
    id: 'rc-019',
    name: 'AOZOL - Hospital do Olho de Campo Grande',
    type: 'oftalmologia',
    address: 'Rua Barcelos Domingos, 118 - Campo Grande - RJ',
    phones: ['2415-9820', '2415-5374'],
    specialties: ['Oftalmologia'],
    exams: ['Exames Oftalmológicos']
  },
  {
    id: 'rc-020',
    name: 'Radio Vitae Serviços Médicos',
    type: 'radiologia',
    address: 'Rua Hildegarda Ribeiro, 53 - Parte - Campo Grande - RJ',
    phones: ['(21) 2416-2392', '2412-1125'],
    specialties: [],
    exams: ['Radioterapia Ambulatorial']
  },
  {
    id: 'rc-021',
    name: 'Onco Vitae Serviços Médicos - Botafogo',
    type: 'oncologia',
    address: 'Rua Voluntários da Pátria, 126 - Grupo 401 - Botafogo - RJ',
    phones: ['(21) 2537-5454'],
    specialties: ['Oncologia', 'Hematologia'],
    exams: []
  },
  {
    id: 'rc-022',
    name: 'Cardiokids Clínica Cardiológica Infantil - Botafogo',
    type: 'clinica',
    address: 'Rua Real Grandeza, 108 - Sala 114 - Botafogo - RJ',
    phones: [],
    specialties: ['Cardiologia Pediátrica', 'Gastro Pediatria', 'Pediatria'],
    exams: [
      'Eletrocardiografia ECG 12 Derivações', 'Ecodopplercardiograma Transtorácico',
      'MAPA 24h', 'Ecocardiografia Fetal e Pediátrica',
      'Ecodoppler Fetal com Mapeamento de Fluxo a Cores', 'Holter 24h'
    ]
  },
  {
    id: 'rc-023',
    name: 'Cardiokids Clínica Cardiológica Infantil - Nova Iguaçu',
    type: 'clinica',
    address: 'Rua Bernardino de Mello, 1399 - Sala 103 - Nova Iguaçu - RJ',
    phones: ['2669-4644'],
    specialties: ['Cardiologia Pediátrica', 'Gastro Pediatria', 'Pediatria'],
    exams: [
      'Eletrocardiografia ECG 12 Derivações', 'Ecodopplercardiograma Transtorácico',
      'MAPA 24h', 'Ecocardiografia Fetal e Pediátrica',
      'Ecodoppler Fetal com Mapeamento de Fluxo a Cores', 'Holter 24h'
    ]
  },
  {
    id: 'rc-024',
    name: 'Centro Radiológico São Judas Tadeu',
    type: 'radiologia',
    address: 'Rua Augusto de Vasconcelos, 754 - Campo Grande - RJ (Centro Empresarial CAMO)',
    phones: ['21-3269-3735'],
    specialties: [],
    exams: ['Densitometria Óssea', 'Mamografia Digital', 'Mamografia Convencional']
  },
  {
    id: 'rc-025',
    name: 'Vidacor Central de Cardiologia',
    type: 'clinica',
    address: 'Rua Getúlio Vargas, nº 87, 1º andar - Centro - Nova Iguaçu - RJ',
    phones: ['(21) 2668-4881'],
    specialties: ['Cardiologia', 'Ginecologia Pediátrica', 'Clínica Médica', 'Nutrição', 'Ginecologia', 'Obstetrícia', 'Pediatria'],
    exams: [
      'Colposcopia', 'Eletrocardiograma', 'Doppler Carótidas e Vertebrais',
      'Holter 24h', 'Dopplerfluxometria Colorido', 'MAPA', 'Ecocardiograma Pediátrico',
      'Preventivo', 'Ecodopplercardiograma', 'Ultrassonografia', 'Teste Ergométrico'
    ]
  },
  {
    id: 'rc-026',
    name: 'Centro Médico Darke',
    type: 'clinica',
    address: 'Avenida Treze de Maio, 23 - Grupo 925/928 - Centro - RJ',
    phones: ['2220-3150', '2220-1300'],
    specialties: ['Oftalmologia'],
    exams: ['Facectomia com Implante de LIO (Ambulatorial)']
  },
  {
    id: 'rc-027',
    name: 'Neurolife Laboratórios - Análise do Líquido Cefalorraquiano',
    type: 'laboratorio',
    address: 'Praia do Flamengo, 66 - Bloco B, Conjunto 219-220 - Flamengo - RJ',
    phones: ['2556-5541', '2557-4038', '2557-4731'],
    specialties: [],
    exams: ['Exame Líquor Ambulatorial', 'Atendimento Ambulatorial (Adulto, Criança e Recém Nascido)']
  },
  {
    id: 'rc-028',
    name: 'Centro Clínico Campo Grande',
    type: 'clinica',
    address: 'Rua Coronel Agostinho, 76 - P Sala 11 - Campo Grande - RJ',
    phones: ['(21) 2413-1784'],
    whatsapp: '(21) 99648-4944',
    specialties: ['Pediatria'],
    exams: ['Vídeo Histeroscopia Diagnóstica', 'Vulvoscopia', 'Colposcopia']
  },
  {
    id: 'rc-029',
    name: 'CEPOR - Centro de Pesquisa de Osteoporose do RJ',
    type: 'clinica',
    address: 'Rua Conde de Bonfim, 369 - Salas 806/807 - Tijuca - RJ',
    phones: ['(21) 2571-6582', '2208-3147'],
    specialties: [],
    exams: ['Densitometria Óssea']
  },
  {
    id: 'rc-030',
    name: 'Laboratório de Análises Clínicas Bittar - Centro Niterói',
    type: 'laboratorio',
    address: 'Rua Dr. Borman, nº 43 - Centro - Niterói - RJ',
    phones: ['(21) 2621-6161'],
    specialties: [],
    exams: ['Análises Clínicas']
  },
  {
    id: 'rc-031',
    name: 'Laboratório de Análises Clínicas Bittar - Icaraí (Shopping)',
    type: 'laboratorio',
    address: 'Rua Cel. Moreira César, 229, conj. 1518/19 - Shopping Icaraí - Niterói - RJ',
    phones: ['(21) 2610-2212'],
    specialties: [],
    exams: ['Análises Clínicas']
  },
  {
    id: 'rc-032',
    name: 'Laboratório de Análises Clínicas Bittar - Icaraí',
    type: 'laboratorio',
    address: 'Rua Presidente Backer, 74 - Icaraí - Niterói - RJ',
    phones: ['(21) 2611-9922'],
    specialties: [],
    exams: ['Análises Clínicas']
  },
  {
    id: 'rc-033',
    name: 'Laboratório de Análises Clínicas Bittar - São Francisco',
    type: 'laboratorio',
    address: 'Av. Rui Barbosa, 153 - Loja 104 - São Francisco - Niterói - RJ',
    phones: ['(21) 2711-3677'],
    specialties: [],
    exams: ['Análises Clínicas']
  },
  {
    id: 'rc-034',
    name: 'Laboratório de Análises Clínicas Bittar - São Gonçalo',
    type: 'laboratorio',
    address: 'Rua Dr. Nilo Peçanha, 110, conj. 1001/1003 - Centro - São Gonçalo - RJ',
    phones: ['(21) 2605-3571'],
    specialties: [],
    exams: ['Análises Clínicas']
  },
  {
    id: 'rc-035',
    name: 'Urologic - Centro de Diagnóstico e Tratamento',
    type: 'clinica',
    address: 'Rua Uruguaiana, 10 - Sala 2107 - Centro - RJ',
    phones: ['21-3852-5435'],
    specialties: ['Urologia'],
    exams: ['Urofluxometria']
  },
  {
    id: 'rc-036',
    name: 'Villela Pedras - Clínica de Medicina Nuclear - Campo Grande',
    type: 'medicina-nuclear',
    address: 'Rua Jaguaruna, nº 44 - Campo Grande - RJ',
    phones: ['(21) 3511-8181', '2529-2269'],
    specialties: ['Medicina Nuclear'],
    exams: [
      'Cintilografia das Glândulas Salivares', 'Cintilografia Hepática',
      'Cintilografia Hepática e Vias Biliares (HIDA)', 'Cintilografia com Hemácias Marcadas',
      'Cintilografia para Divertículo de Meckel', 'Cintilografia Trânsito Esofágico',
      'Cintilografia Refluxo Gastroesofágico', 'Cintilografia Esvaziamento Gástrico',
      'Elastografia', 'Cintilografia da Tireoide', 'Cintilografia das Paratireoides',
      'Cintilografia Renal Estática (DMSA)', 'Cintilografia Renal Dinâmica (DTPA)',
      'Cistografia', 'Cintilografia Testicular', 'Cintilografia Óssea',
      'Cintilografia do Miocárdio', 'Cintilografia Pulmonar Perfusão',
      'Cintilografia Pulmonar Ventilação', 'Cintilografia Cerebral',
      'Cisternocintilografia', 'Cintilografia com Gálio 67',
      'Cintilografia com MIBG', 'PET-CT Oncológico',
      'Linfocintilografia Mamária', 'Linfocintilografia Membros'
    ]
  },
  {
    id: 'rc-037',
    name: 'Villela Pedras - Clínica de Medicina Nuclear - Centro',
    type: 'medicina-nuclear',
    address: 'Rua México, nº 98 - 3º, 4º e 5º andares - Centro - RJ',
    phones: ['(21) 3511-8181', '2529-2269'],
    specialties: ['Medicina Nuclear'],
    exams: [
      'Cintilografia das Glândulas Salivares', 'Cintilografia Hepática',
      'Cintilografia do Miocárdio', 'Cintilografia Pulmonar',
      'Cintilografia Cerebral', 'PET-CT Oncológico'
    ]
  },
  {
    id: 'rc-038',
    name: 'Villela Pedras - Clínica de Medicina Nuclear - Leblon',
    type: 'medicina-nuclear',
    address: 'Rua Carlos Góis, nº 375 - 1º e 2º andares - Leblon - RJ',
    phones: ['(21) 3511-8181', '2529-2269'],
    specialties: ['Medicina Nuclear'],
    exams: [
      'Cintilografia das Glândulas Salivares', 'Cintilografia Hepática',
      'Cintilografia do Miocárdio', 'Cintilografia Pulmonar',
      'Cintilografia Cerebral', 'PET-CT Oncológico'
    ]
  },
  {
    id: 'rc-039',
    name: 'Villela Pedras - Clínica de Medicina Nuclear - Icaraí',
    type: 'medicina-nuclear',
    address: 'Rua Lopes Trovão, nº 390 - Loja 103 - Icaraí - Niterói - RJ',
    phones: ['(21) 3511-8181', '2529-2269'],
    specialties: ['Medicina Nuclear'],
    exams: [
      'Cintilografia das Glândulas Salivares', 'Cintilografia Hepática',
      'Cintilografia do Miocárdio', 'Cintilografia Pulmonar',
      'Cintilografia Cerebral', 'PET-CT Oncológico'
    ]
  },
  {
    id: 'rc-040',
    name: 'Neovisão Oftalmologia - Recreio',
    type: 'oftalmologia',
    address: 'Av. das Américas, nº 12.900 - Bloco 3 - Sala 220 - Recreio dos Bandeirantes - RJ',
    phones: ['3556-0101'],
    specialties: ['Oftalmologia'],
    exams: [
      'Biometria Ultrassônica', 'Mapeamento de Retina', 'Campimetria Computadorizada',
      'Potencial de Acuidade Visual (PAM)', 'Capsulotomia com Yag Laser',
      'Paquimetria Ultrassônica', 'Curva Tensional Diária', 'Retinografia',
      'Ceratoscopia (Topografia)', 'Retirada de Corpo Estranho',
      'Exercícios de Ortóptica', 'Teste Provocativo para Glaucoma',
      'Exercícios de Pleóptica', 'Tonometria de Aplanação', 'Epilação',
      'Teste do Reflexo Vermelho', 'Fotocoagulação a Laser',
      'Teste de Sensibilidade de Contraste ou de Cores',
      'Fundoscopia sob Midríase', 'Teste Ortóptico',
      'Gonioscopia', 'Ultrassonografia Ocular', 'Iridotomia a Laser',
      'Visão Subnormal', 'Microscopia Especular da Córnea'
    ]
  },
  {
    id: 'rc-041',
    name: 'Ápice Hospital Dia / Pronto Atendimento',
    type: 'hospital-dia',
    address: 'Av. Automóvel Clube, 63 - Centro - São João de Meriti - RJ',
    phones: [],
    whatsapp: '(21) 3668-3131',
    hours: 'Segunda a Sábado das 08h às 17h',
    specialties: [
      'Angiologia', 'Cirurgia Vascular', 'Cardiologia', 'Alergologia',
      'Clínica Médica Pediátrica', 'Reumatologia', 'Cirurgia Geral',
      'Clínica Médica', 'Dermatologia', 'Endocrinologia', 'Fonoaudiologia',
      'Fisioterapia', 'Gastroenterologia', 'Geriatria', 'Ginecologia',
      'Neurologia', 'Nutrição', 'Oftalmologia', 'Ortopedia',
      'Otorrinolaringologia', 'Pediatria', 'Pneumologia', 'Proctologia',
      'Psicologia', 'Urologia'
    ],
    exams: [
      'Densitometria', 'Pesquisa de Nistagmo Optocinético', 'Mamografia',
      'Registro do Nistagmo Pendular', 'Laboratório Análises Clínicas',
      'Eletroencefalograma com Mapeamento Cerebral', 'Ultrassonografia',
      'Eletroneuromiografia', 'Ecocardiograma', 'Vídeo-Endoscopia Naso-Sinusal',
      'Mapa 24h', 'Holter 24h', 'Vídeo-Faringo-Laringoscopia',
      'Eco com Estresse Farmacológico', 'Nasofibrolaringoscopia',
      'Eco Fetal', 'Pesquisa de Pares Cranianos', 'Acupuntura',
      'Biópsia do Cavum', 'Teste Ergométrico', 'Audiometria',
      'Impedanciometria', 'Biópsia Percutânea guiada por RX/USG',
      'Vectoeletronistagmografia', 'Endoscopia Digestiva Alta',
      'Eletrocoagulação do Colo Uterino', 'Radiologia',
      'Colposcopia', 'Vulvoscopia', 'Urodinâmica Completa',
      'Urofluxometria', 'Testes de Contato', 'Provas Imuno-Alérgicas',
      'Fisioterapia'
    ]
  },
  {
    id: 'rc-042',
    name: 'Neuroclass - Campo Grande',
    type: 'clinica',
    address: 'Avenida Cesário de Melo, 2623 - Sala 508 - Campo Grande - RJ',
    phones: ['2567-1556', '2412-1355', '2423-1155'],
    specialties: ['Neurofisiologia'],
    exams: [
      'Eletroneuromiografia (MMII, MMSS e Facial)',
      'Potenciais Evocados Somatossensitivos',
      'Potenciais Evocados Visuais', 'Potenciais Evocados Auditivos'
    ]
  },
  {
    id: 'rc-043',
    name: 'Neuroclass - Copacabana',
    type: 'clinica',
    address: 'Rua Siqueira Campos, 59 - Grupo 507 - Copacabana - RJ',
    phones: ['3816-8855'],
    specialties: ['Neurofisiologia'],
    exams: [
      'Eletroneuromiografia (MMII, MMSS e Facial)',
      'Potenciais Evocados Somatossensitivos',
      'Potenciais Evocados Visuais', 'Potenciais Evocados Auditivos'
    ]
  },
  {
    id: 'rc-044',
    name: 'CMNG - Instituto Hermes Pardini',
    type: 'laboratorio',
    address: 'Múltiplas unidades (Centro, Campo Grande, Copacabana, Duque de Caxias, Jacarepaguá, Madureira, Meier, Nova Iguaçu, São Gonçalo, Tijuca, Vila da Penha)',
    phones: ['21-4002-0203'],
    whatsapp: '21-4002-0203',
    specialties: [],
    exams: [
      'Análises Clínicas', 'Citopatologia', 'Anatomia Patológica',
      'Mamografia Digital Bilateral', 'Punção Aspirativa (PAAF)',
      'Tomografia Computadorizada', 'PET-CT Oncológico',
      'Angiotomografia', 'Ressonância Magnética', 'Angioressonância',
      'Cintilografias', 'Ultrassonografia', 'Dopplerfluxometria Colorido',
      'Ecodopplercardiograma', 'Densitometria Óssea', 'Core Biopsy de Mama',
      'Mamotomia', 'Elastografia', 'Imunofenotipagem'
    ]
  },
  {
    id: 'rc-045',
    name: 'COA - Clínica de Oftalmologia Avançada de Campo Grande',
    type: 'oftalmologia',
    address: 'Rua Coronel Agostinho, 76 - Sls 215 e 304 - Campo Grande - RJ',
    phones: ['2412-0528', '2411-7999', '2411-8308', '2415-1482'],
    specialties: ['Oftalmologia Adulto', 'Oftalmologia Infantil'],
    exams: [
      'Acuidade Visual a Laser (PAM)', 'Ultrassonografia Ocular',
      'Biometria Ultrassônica', 'Ceratoscopia (Topografia)',
      'Curva Tensional Diária', 'Campimetria Computadorizada',
      'Gonioscopia', 'Microscopia Especular da Córnea',
      'Mapeamento de Retina', 'Paquimetria Ultrassônica',
      'Tonometria de Aplanação', 'Retinografia'
    ]
  },
  {
    id: 'rc-046',
    name: 'RDX - Dom Duque Serviços Médicos (Plaza Office)',
    type: 'radiologia',
    address: 'Avenida Maria Teresa, nº 260 - Bloco 03 - Sala 217 - Campo Grande - RJ',
    phones: ['(021) 2412-5793'],
    whatsapp: '(21) 99880-0158',
    specialties: [],
    exams: ['Radiologia']
  },
  {
    id: 'rc-047',
    name: 'SUSGA - Serviço de Ultrassonografia Alcântara',
    type: 'laboratorio',
    address: 'Rua Laureano Rosa, nº 166 - Alcântara - São Gonçalo - RJ',
    phones: ['3799-8988', '2602-3750'],
    whatsapp: '98604-3860',
    specialties: [],
    exams: [
      'Mamografia Digital', 'Mamografia Convencional', 'Densitometria Óssea',
      'Radiologia', 'Ecocardiograma', 'Ultrassonografia', 'Ressonância Magnética',
      'Tomografia Computadorizada', 'Vídeo Endoscopia', 'Punções', 'Biópsias',
      'Histerossalpingografia'
    ]
  },
  {
    id: 'rc-048',
    name: 'Médico Saúde Diagnóstico',
    type: 'clinica',
    address: 'Av. Cônego Vasconcelos, nº 423 - Sala 204 - Bangu - RJ',
    phones: [],
    whatsapp: '2199333-2990',
    specialties: ['Gastroenterologia', 'Nutrição'],
    exams: ['Vídeo Endoscopia Digestiva', 'Retossigmoidoscopia']
  },
  {
    id: 'rc-049',
    name: 'Sommar Vitta Centro de Reabilitação',
    type: 'reabilitacao',
    address: 'Avenida Nilo Peçanha, nº 545 - Sala 502 - Centro - Nova Iguaçu - RJ',
    phones: ['(21) 2797-4504'],
    specialties: [],
    exams: [
      'Fisioterapia Neurológica', 'Fisioterapia Reumatológica',
      'Fisioterapia Cardíaca', 'Fisioterapia Cardiovascular'
    ]
  },
  {
    id: 'rc-050',
    name: 'Otorrinos Associados da Zona Oeste',
    type: 'clinica',
    address: 'Avenida Cesário de Melo, nº 1969 - Campo Grande - RJ',
    phones: ['(21) 2413-2000'],
    specialties: ['Otorrinolaringologia'],
    exams: [
      'Testes Vestibulares', 'Audiometria', 'Vectoeletronistagmografia',
      'Pesquisa de Fenômeno de Tulio', 'Pesquisa de Pares Cranianos',
      'Registro de Nistagmo Pendular', 'Pesquisa do Nistagmo Optocinético',
      'Retirada de Corpo Estranho', 'Impedanciometria (Timpanometria)',
      'Vídeo Laringo-Estroboscopia', 'Vídeo Faringo',
      'Vídeo EDA Nasal', 'Remoção de Cerume'
    ]
  }
];

/**
 * Retorna todos os exames únicos disponíveis na rede credenciada
 */
export function getAllExams(): string[] {
  const examsSet = new Set<string>();
  redeCredenciada.forEach(provider => {
    provider.exams.forEach(exam => examsSet.add(exam));
  });
  return Array.from(examsSet).sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

/**
 * Busca locais que oferecem um determinado exame
 */
export function findProvidersByExam(examQuery: string): CredentialedProvider[] {
  const query = examQuery.toLowerCase().trim();
  return redeCredenciada.filter(provider =>
    provider.exams.some(exam => exam.toLowerCase().includes(query))
  );
}

/**
 * Busca locais por especialidade
 */
export function findProvidersBySpecialty(specialtyQuery: string): CredentialedProvider[] {
  const query = specialtyQuery.toLowerCase().trim();
  return redeCredenciada.filter(provider =>
    provider.specialties.some(spec => spec.toLowerCase().includes(query))
  );
}
