export type EmergencyAlertData = {
  level: string;
  structure: string;
  title: string;
  message: string;
  isSimulation?: boolean;
  isEfni?: boolean;
};

export const emergencyCopy = {
  ptBR: {
    acionamento: {
      titlePrefix: "Confirmacao de",
      titleHighlight: "Alerta",
      description:
        "Deslize o botao para ativar o protocolo de evacuacao imediata.",
      sliderLabel: "Deslizar para disparar alerta",
      sliderHint:
        "Deslize totalmente para a direita para confirmar ou use a acao de ativar",
      sliderText: "DESLIZE PARA DISPARAR",
      cancelButton: "Cancelar & Voltar",
      accessibilityConfirmLabel: "Confirmar alerta",
      accessibilityConfirmHint:
        "Ativa imediatamente o protocolo de emergencia",
    },
    alertScreen: {
      subtitle: "PROTOCOLO CRITICO",
      title: "EVACUACAO",
      badge: "ALERTA ATIVO",
      openProtocolButton: "ABRIR PROTOCOLO",
    },
    modal: {
      speak: "OUVIR MENSAGEM",
      pause: "PAUSAR AUDIO",
      resume: "CONTINUAR AUDIO",
      acknowledge: "CONFIRMAR E SAIR",
      simulatedBadge: "SIMULADO",
      efniBadge: "EXERCICIO INTERNO - EFNI",
      officialBadge: "ALERTA OFICIAL",
    },
  },
} as const;

export const defaultEmergencyAlert: EmergencyAlertData = {
  level: "Nivel 3",
  structure: "B1 Ipe",
  title: "Ruptura da Barragem",
  message: `Alerta de Emergencia Nivel 3.
Ruptura da barragem B1 Ipe Mina. Iminente ou ocorrendo.
Dar inicio as Acoes de Emergencia em Nivel 3.
Providenciar os recursos necessarios para atendimento.`,
};

export function buildEmergencySpeechText(alertData: EmergencyAlertData) {
  return `${alertData.level}. Estrutura ${alertData.structure}. ${alertData.title}. ${alertData.message}`;
}
