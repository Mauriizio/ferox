export type Edad = "cachorro" | "adulto" | "senior";
export type Actividad = "baja" | "moderada" | "alta";
export type EstadoFisico = "normal" | "esterilizado" | "sobrepeso";

export type FeedingInput = {
  peso: number;
  edad: Edad;
  actividad: Actividad;
  estadoFisico: EstadoFisico;
};

export type FeedingResult = {
  gramosDia: number;
  gramosMes: number;
  porcentaje: number;
};

export function calcularPorcentajeBarf(
  edad: Edad,
  actividad: Actividad,
  estadoFisico: EstadoFisico,
): number {
  let porcentaje: number;

  if (edad === "cachorro") {
    porcentaje = 0.07;
  } else if (edad === "senior") {
    porcentaje = 0.0175;
  } else if (actividad === "baja") {
    porcentaje = 0.02;
  } else if (actividad === "moderada") {
    porcentaje = 0.025;
  } else {
    porcentaje = 0.03;
  }

  if (estadoFisico === "sobrepeso") {
    return 0.015;
  }

  if (estadoFisico === "esterilizado") {
    return porcentaje * 0.9;
  }

  return porcentaje;
}

export function calcularRacionBarf({
  peso,
  edad,
  actividad,
  estadoFisico,
}: FeedingInput): FeedingResult {
  if (!peso || peso <= 0 || Number.isNaN(peso)) {
    return { gramosDia: 0, gramosMes: 0, porcentaje: 0 };
  }

  const porcentaje = calcularPorcentajeBarf(edad, actividad, estadoFisico);
  const gramosDia = Math.round(peso * porcentaje * 1000);

  return {
    gramosDia,
    gramosMes: gramosDia * 30,
    porcentaje,
  };
}
