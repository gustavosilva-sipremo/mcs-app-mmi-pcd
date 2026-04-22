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
