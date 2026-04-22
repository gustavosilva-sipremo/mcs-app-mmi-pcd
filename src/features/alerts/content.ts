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
      titlePrefix: "Confirmação de",
      titleHighlight: "Alerta",
      description:
        "Deslize o botão para ativar o protocolo de evacuação imediata.",
      sliderLabel: "Deslizar para disparar alerta",
      sliderHint:
        "Deslize totalmente para a direita para confirmar ou use a ação de ativar",
      sliderText: "DESLIZE PARA DISPARAR",
      cancelButton: "Cancelar & Voltar",
      accessibilityConfirmLabel: "Confirmar alerta",
      accessibilityConfirmHint: "Ativa imediatamente o protocolo de emergência",
    },
    alertScreen: {
      subtitle: "PROTOCOLO CRÍTICO",
      title: "EVACUAÇÃO",
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
  structure: "B1 Ipê",
  title: "Ruptura da Barragem",
  message: `Alerta de Emergência Nível 3.
Ruptura da barragem B1 Ipê Mina. Iminente ou ocorrendo.
Dar inicio as Ações de Emergência em Nível 3.
Providenciar os recursos necessários para atendimento.`,
};

export function buildEmergencySpeechText(alertData: EmergencyAlertData) {
  return `${alertData.level}. Estrutura ${alertData.structure}. ${alertData.title}. ${alertData.message}`;
}
