/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataType } from "../db";
import logger from "./logger";

export default async (url: string): Promise<DataType | DataType[]> => {
  logger(`Getting data from: ${url}`);

  const res = await fetch(
    `https://api.portaldatransparencia.gov.br/api-de-dados/${url}`,
    {
      method: "GET",
      headers: {
        "chave-api-dados": process.env.PORTAL_TRANSPARENCIA_TOKEN,
        Accept: "application/json",
      } as any,
    }
  );
  console.log(res);

  return {
    id: 1,
    viagem: {
      motivo: "string",
      pcdp: "string",
      ano: 0,
      numPcdp: "string",
      justificativaUrgente: "string",
      urgenciaViagem: "string",
    },
    situacao: "string",
    beneficiario: {
      cpfFormatado: "string",
      nis: "string",
      nome: "string",
    },
    cargo: {
      codigoSIAPE: "string",
      descricao: "string",
    },
    funcao: {
      codigoSIAPE: "string",
      descricao: "string",
    },
    tipoViagem: "string",
    orgao: {
      nome: "string",
      codigoSIAFI: "string",
      cnpj: "string",
      sigla: "string",
      descricaoPoder: "string",
      orgaoMaximo: {
        codigo: "string",
        sigla: "string",
        nome: "string",
      },
    },
    orgaoPagamento: {
      nome: "string",
      codigoSIAFI: "string",
      cnpj: "string",
      sigla: "string",
      descricaoPoder: "string",
      orgaoMaximo: {
        codigo: "string",
        sigla: "string",
        nome: "string",
      },
    },
    unidadeGestoraResponsavel: {
      codigo: "string",
      nome: "string",
      descricaoPoder: "string",
      orgaoVinculado: {
        codigoSIAFI: "string",
        cnpj: "string",
        sigla: "string",
        nome: "string",
      },
      orgaoMaximo: {
        codigo: "string",
        sigla: "string",
        nome: "string",
      },
    },
    dataInicioAfastamento: new Date("2025-04-11"),
    dataFimAfastamento: new Date("2025-04-11"),
    valorTotalRestituicao: 0,
    valorTotalTaxaAgenciamento: 0,
    valorMulta: 0,
    valorTotalDiarias: 0,
    valorTotalPassagem: 0,
    valorTotalViagem: 0,
    valorTotalDevolucao: 0,
  };
};
