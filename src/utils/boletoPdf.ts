import { jsPDF } from 'jspdf';
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';

export interface BoletoData {
  // Banco
  sCodigoBancoCompleto: string;
  sNomeBanco: string;
  // Cedente
  sRazaoSocial: string;
  sCGC: string;
  sAgenciaCedente: string;
  // Sacado
  sAssociado: string;
  sNomeTIT: string;
  sCgcCpf: string;
  sMatricula: string;
  sSacadoEnd1: string;
  sSacadoEnd2: string;
  sSacadoEnd3: string;
  // Boleto
  sNossoNumero: string;
  sNumDoc: string;
  sDocumento: string;
  dVencimento: string;
  dEmissao: string;
  dPeriodoCompetencia: string;
  cValorMensalidade: string;
  cTotalAPagar: string;
  cDesconto: string;
  cMoraMultaJuros: string;
  cOutrosAcrescimos: string;
  cOutrasDeducoes: string;
  sParcela: string;
  sCarteira: string;
  sEspecieDoc: string;
  sAceite: string;
  sEspecieMoeda: string;
  // Códigos
  sCodigoBarras: string;
  sIPTE: string;
  // Instruções
  mInstrucoes: string;
  sAvisoLocalPagamento1: string;
  mMSGNoBoleto: string;
  // Contrato
  sNumeroCNT: string;
  sTipoContrato: string;
  // PIX QR Code (EMV)
  sEMV?: string;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  }
  return dateStr;
}

function formatCurrency(value: string): string {
  const num = parseFloat(value?.replace(',', '.') || '0');
  return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** Converte a logo PNG para base64 via canvas */
async function loadLogoAsBase64(): Promise<string | null> {
  try {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    return new Promise((resolve) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        } else {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = '/img/logo.png';
    });
  } catch {
    return null;
  }
}

// Brand colors
const BRAND_BLUE = [0, 98, 209] as const; // primary-600
const BRAND_DARK = [0, 35, 71] as const;  // primary-900
const LIGHT_GRAY = [245, 245, 244] as const;
const MEDIUM_GRAY = [120, 113, 108] as const;

export async function generateBoletoPdf(data: BoletoData): Promise<void> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageWidth = 210;
  const ml = 12; // margin left
  const mr = 12; // margin right
  const cw = pageWidth - ml - mr; // content width

  let y = 10;

  // Load logo
  const logoBase64 = await loadLogoAsBase64();

  // ==============================
  // HEADER - Logo + Recibo do Pagador
  // ==============================
  doc.setFillColor(...BRAND_BLUE);
  doc.rect(0, 0, pageWidth, 28, 'F');

  if (logoBase64) {
    doc.addImage(logoBase64, 'PNG', ml, 4, 40, 20);
  } else {
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('AMACOR', ml + 5, 17);
  }

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('2ª Via de Boleto', pageWidth / 2, 12, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Competência: ${data.dPeriodoCompetencia || ''}  |  Parcela: ${data.sParcela || ''}`, pageWidth / 2, 20, { align: 'center' });

  doc.setTextColor(0, 0, 0);
  y = 34;

  // ==============================
  // LINHA DIGITÁVEL
  // ==============================
  doc.setFillColor(...LIGHT_GRAY);
  doc.roundedRect(ml, y, cw, 10, 2, 2, 'F');
  doc.setFontSize(10);
  doc.setFont('courier', 'bold');
  doc.setTextColor(...BRAND_DARK);
  doc.text(data.sIPTE || '', pageWidth / 2, y + 6.5, { align: 'center' });

  y += 14;
  doc.setTextColor(0, 0, 0);

  // ==============================
  // BANCO + NOSSO NÚMERO
  // ==============================
  doc.setDrawColor(...BRAND_BLUE);
  doc.setLineWidth(0.6);
  doc.line(ml, y, ml + cw, y);

  y += 5;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...BRAND_BLUE);
  doc.text(data.sCodigoBancoCompleto || '341-7', ml, y);

  doc.setFontSize(10);
  doc.setTextColor(...BRAND_DARK);
  doc.text(data.sNomeBanco || '', ml + 22, y);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...MEDIUM_GRAY);
  doc.text('Nosso Número', pageWidth - mr, y - 2, { align: 'right' });
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(data.sNossoNumero || '', pageWidth - mr, y + 2, { align: 'right' });

  y += 6;
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(ml, y, ml + cw, y);

  // ==============================
  // LOCAL DE PAGAMENTO + VENCIMENTO
  // ==============================
  y += 4;
  drawFieldLabel(doc, ml, y, 'Local de Pagamento');
  y += 4;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(data.sAvisoLocalPagamento1 || '', ml, y);

  // Vencimento box
  const vencBoxX = pageWidth - mr - 42;
  doc.setFillColor(...BRAND_BLUE);
  doc.roundedRect(vencBoxX, y - 7, 42, 14, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('Vencimento', vencBoxX + 21, y - 3, { align: 'center' });
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(formatDate(data.dVencimento), vencBoxX + 21, y + 3, { align: 'center' });

  doc.setTextColor(0, 0, 0);
  y += 7;
  doc.setDrawColor(220, 220, 220);
  doc.line(ml, y, ml + cw, y);

  // ==============================
  // CEDENTE
  // ==============================
  y += 4;
  drawFieldLabel(doc, ml, y, 'Beneficiário/Cedente');
  drawFieldLabel(doc, pageWidth - mr - 42, y, 'Agência/Código Cedente');

  y += 4;
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(data.sRazaoSocial || '', ml, y, { maxWidth: cw - 50 });
  doc.setFont('helvetica', 'normal');
  doc.text(data.sAgenciaCedente || '', pageWidth - mr - 42, y);

  y += 4;
  doc.setFontSize(7);
  doc.text(`CNPJ: ${data.sCGC || ''}`, ml, y);

  y += 4;
  doc.setDrawColor(220, 220, 220);
  doc.line(ml, y, ml + cw, y);

  // ==============================
  // GRID DE DADOS (2 linhas)
  // ==============================
  y += 3;
  const cols5 = cw / 5;

  // Row 1
  drawFieldLabel(doc, ml, y, 'Data Documento');
  drawFieldLabel(doc, ml + cols5, y, 'Nº Documento');
  drawFieldLabel(doc, ml + cols5 * 2, y, 'Espécie');
  drawFieldLabel(doc, ml + cols5 * 3, y, 'Carteira');
  drawFieldLabel(doc, ml + cols5 * 4, y, 'Valor Documento');

  y += 4;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(formatDate(data.dEmissao), ml, y);
  doc.text(data.sNumDoc || '', ml + cols5, y);
  doc.text(data.sEspecieDoc || '', ml + cols5 * 2, y);
  doc.text(data.sCarteira || '', ml + cols5 * 3, y);
  doc.setTextColor(...BRAND_BLUE);
  doc.text(`R$ ${formatCurrency(data.cTotalAPagar)}`, ml + cols5 * 4, y);
  doc.setTextColor(0, 0, 0);

  y += 4;
  doc.setDrawColor(220, 220, 220);
  doc.line(ml, y, ml + cw, y);

  // Row 2
  y += 3;
  drawFieldLabel(doc, ml, y, 'Parcela');
  drawFieldLabel(doc, ml + cols5, y, 'Competência');
  drawFieldLabel(doc, ml + cols5 * 2, y, 'Aceite');
  drawFieldLabel(doc, ml + cols5 * 3, y, 'Moeda');
  drawFieldLabel(doc, ml + cols5 * 4, y, '(=) Valor Cobrado');

  y += 4;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(data.sParcela || '', ml, y);
  doc.text(data.dPeriodoCompetencia || '', ml + cols5, y);
  doc.text(data.sAceite || 'N', ml + cols5 * 2, y);
  doc.text(data.sEspecieMoeda || 'R$', ml + cols5 * 3, y);
  doc.setTextColor(...BRAND_BLUE);
  doc.setFontSize(10);
  doc.text(`R$ ${formatCurrency(data.cTotalAPagar)}`, ml + cols5 * 4, y);
  doc.setTextColor(0, 0, 0);

  y += 5;
  doc.setDrawColor(220, 220, 220);
  doc.line(ml, y, ml + cw, y);

  // ==============================
  // INSTRUÇÕES + VALORES
  // ==============================
  y += 4;
  drawFieldLabel(doc, ml, y, 'Instruções');

  y += 4;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  const instrucoes = data.mInstrucoes || '';
  const instrLines = doc.splitTextToSize(instrucoes, cw * 0.6);
  doc.text(instrLines, ml, y);

  if (data.mMSGNoBoleto) {
    doc.setFontSize(7);
    doc.setTextColor(...MEDIUM_GRAY);
    doc.text(data.mMSGNoBoleto, ml, y + instrLines.length * 3.5 + 2);
    doc.setTextColor(0, 0, 0);
  }

  // Valores à direita
  const valX = pageWidth - mr - 50;
  let valY = y - 1;
  const valItems = [
    ['(-) Desconto', data.cDesconto],
    ['(-) Outras Deduções', data.cOutrasDeducoes],
    ['(+) Mora/Multa/Juros', data.cMoraMultaJuros],
    ['(+) Outros Acréscimos', data.cOutrosAcrescimos],
  ];

  valItems.forEach(([label, val]) => {
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...MEDIUM_GRAY);
    doc.text(label, valX, valY);
    doc.setTextColor(0, 0, 0);
    doc.text(`R$ ${formatCurrency(val)}`, valX + 40, valY);
    valY += 5;
  });

  y = Math.max(y + instrLines.length * 3.5 + 6, valY + 4);
  doc.setDrawColor(220, 220, 220);
  doc.line(ml, y, ml + cw, y);

  // ==============================
  // PAGADOR
  // ==============================
  y += 4;
  drawFieldLabel(doc, ml, y, 'Pagador');

  y += 4;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(data.sNomeTIT || data.sAssociado || '', ml, y);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`CPF: ${data.sCgcCpf || ''}`, ml + 70, y);
  doc.text(`Matrícula: ${data.sMatricula || ''}`, ml + 115, y);

  y += 5;
  doc.setFontSize(8);
  doc.text(data.sSacadoEnd1 || '', ml, y);
  y += 4;
  doc.text(`${data.sSacadoEnd2 || ''} - CEP: ${data.sSacadoEnd3 || ''}`, ml, y);

  y += 6;
  doc.setDrawColor(220, 220, 220);
  doc.line(ml, y, ml + cw, y);

  // ==============================
  // CONTRATO
  // ==============================
  y += 4;
  doc.setFontSize(7);
  doc.setTextColor(...MEDIUM_GRAY);
  doc.text(`Contrato: ${data.sNumeroCNT || ''}  |  Tipo: ${data.sTipoContrato || ''}`, ml, y);
  doc.setTextColor(0, 0, 0);

  // ==============================
  // CÓDIGO DE BARRAS (ITF - Interleaved 2 of 5)
  // ==============================
  y += 8;
  doc.setDrawColor(...BRAND_BLUE);
  doc.setLineWidth(0.5);
  doc.line(ml, y, ml + cw, y);

  y += 4;

  // Gerar código de barras real usando JsBarcode em canvas
  const barcode = data.sCodigoBarras || '';
  if (barcode.length > 0) {
    try {
      const canvas = document.createElement('canvas');
      JsBarcode(canvas, barcode, {
        format: 'ITF',
        width: 1.5,
        height: 50,
        displayValue: false,
        margin: 0,
      });
      const barcodeDataUrl = canvas.toDataURL('image/png');
      // Barcode image: ~170mm wide, 16mm tall
      const barcodeWidth = Math.min(cw, 170);
      doc.addImage(barcodeDataUrl, 'PNG', ml, y, barcodeWidth, 16);
    } catch {
      // Fallback: mostrar números do código de barras
      doc.setFontSize(8);
      doc.setFont('courier', 'normal');
      doc.text(barcode, ml, y + 8);
    }
  }

  y += 20;

  // ==============================
  // PIX QR CODE (se disponível)
  // ==============================
  if (data.sEMV) {
    try {
      const qrDataUrl = await QRCode.toDataURL(data.sEMV, {
        width: 200,
        margin: 1,
        color: { dark: '#000000', light: '#ffffff' },
      });

      // QR Code à direita, info PIX à esquerda
      const qrSize = 32;
      const qrX = pageWidth - mr - qrSize;
      const qrY = y;

      doc.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);

      // Label PIX
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...BRAND_BLUE);
      doc.text('Pague com PIX', ml, qrY + 5);

      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...MEDIUM_GRAY);
      doc.text('Escaneie o QR Code ao lado com o', ml, qrY + 10);
      doc.text('aplicativo do seu banco para pagar', ml, qrY + 14);
      doc.text('instantaneamente.', ml, qrY + 18);

      doc.setFontSize(6);
      doc.text('PIX Itaú - AMACOR SAUDE', ml, qrY + 24);

      y += qrSize + 4;
    } catch {
      // Se falhar a geração do QR, continua sem ele
    }
  }

  doc.setTextColor(0, 0, 0);

  // ==============================
  // LINHA DIGITÁVEL INFERIOR
  // ==============================
  doc.setFillColor(...LIGHT_GRAY);
  doc.roundedRect(ml, y, cw, 10, 2, 2, 'F');
  doc.setFontSize(10);
  doc.setFont('courier', 'bold');
  doc.setTextColor(...BRAND_DARK);
  doc.text(data.sIPTE || '', pageWidth / 2, y + 6.5, { align: 'center' });

  y += 14;
  doc.setTextColor(...MEDIUM_GRAY);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('Autenticação Mecânica — Ficha de Compensação', pageWidth / 2, y, { align: 'center' });

  // ==============================
  // RODAPÉ
  // ==============================
  y += 8;
  doc.setDrawColor(...BRAND_BLUE);
  doc.setLineWidth(0.3);
  doc.line(ml, y, ml + cw, y);

  // Mensagens obrigatórias
  y += 5;
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...BRAND_DARK);
  doc.text('SAC e WhatsApp MH VIDA - TEL: (21) 3405-9466 e (21) 99018-4171', ml, y);

  y += 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(...MEDIUM_GRAY);

  const msgLines = [
    'SEGUNDA VIA DE BOLETO ACESSE O SITE: https://amacorplanosdesaude.com.br/',
    'SEU PLANO AGORA TEM ACESSO A TELEMEDICINA PELO SITE: telemedicina.amacorsaude.com.br/login',
    '',
    'DE ACORDO COM A LEI nº 9.656/1998 E A RN nº 593/2023 DA ANS, O CONTRATO PODERÁ SER CANCELADO, SE O PAGAMENTO DE,',
    'NO MÍNIMO, DUAS MENSALIDADES NÃO FOR REALIZADO, SEJA DE FORMA CONSECUTIVA OU NÃO.',
    '',
    'AS COMUNICAÇÕES OFICIAIS DA OPERADORA SÃO REALIZADAS POR MEIO DO E-MAIL INFORMADO PELO BENEFICIÁRIO NO CONTRATO,',
    'O QUAL É RECONHECIDO COMO CANAL OFICIAL PARA ENVIO DE NOTIFICAÇÕES, INCLUSIVE AQUELAS RELACIONADAS À INADIMPLÊNCIA',
    'E CANCELAMENTO DO PLANO DE SAÚDE.',
    '',
    'INFORMAMOS QUE ESTE PLANO PODERÁ SOFRER REAJUSTE EM DECORRÊNCIA DA ALTERAÇÃO DE FAIXA ETÁRIA DO BENEFICIÁRIO,',
    'CONFORME NORMAS CONTRATUAIS E REGULAMENTAÇÃO DA ANS.',
    '',
    'A MH Vida agradece a sua confiança. Estamos à disposição para atendê-lo sempre que necessário.',
  ];

  msgLines.forEach((line) => {
    if (line === '') {
      y += 2;
    } else {
      doc.text(line, ml, y);
      y += 3;
    }
  });

  // Código ANS
  y += 3;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...BRAND_DARK);
  doc.text('Registro ANS: 412015', ml, y);

  y += 5;
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...MEDIUM_GRAY);
  doc.text('Documento gerado pelo Portal do Beneficiário Amacor — amacorsaude.com.br', pageWidth / 2, y, { align: 'center' });

  // Salvar PDF
  doc.setTextColor(0, 0, 0);
  const fileName = `boleto_${data.sNumDoc || 'download'}_${formatDate(data.dVencimento).replace(/\//g, '-')}.pdf`;
  doc.save(fileName);
}

/** Helper para desenhar labels pequenas em cinza */
function drawFieldLabel(doc: jsPDF, x: number, y: number, label: string) {
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...MEDIUM_GRAY);
  doc.text(label, x, y);
  doc.setTextColor(0, 0, 0);
}
