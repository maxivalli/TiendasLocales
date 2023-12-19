export default function isStoreOpen(dias, horarios)  {
    const diasSemana = [
      "domingo",
      "lunes",
      "martes",
      "miércoles",
      "jueves",
      "viernes",
      "sábado",
    ];

    const now = new Date();
    const currentDay = diasSemana[now.getDay()];
    const currentTime = now.getHours() * 100 + now.getMinutes();
    
    const matchDays = dias.match(/De (\w+) a (\w+) excepto (\w+)/i);

    let diaExcluido;

    if (matchDays) {
      const primerDia = matchDays[1].toLowerCase();
      const ultimoDia = matchDays[2].toLowerCase();
      if (matchDays[3]) {
        diaExcluido = matchDays[3].toLowerCase();
      }

      const primerDiaIndex = diasSemana.indexOf(primerDia);
      const ultimoDiaIndex = diasSemana.indexOf(ultimoDia);

      if (primerDiaIndex !== -1 && ultimoDiaIndex !== -1) {
        if (now.getDay() >= primerDiaIndex && now.getDay() <= ultimoDiaIndex) {
          if (diaExcluido && currentDay === diaExcluido) {
            return false;
          }

          const openingTime = parseInt(
            horarios.horario_de_apertura.replace(":", ""),
            10
          );
          const closingTime = parseInt(
            horarios.horario_de_cierre.replace(":", ""),
            10
          );

          if (openingTime <= closingTime) {
            if (currentTime >= openingTime && currentTime <= closingTime) {
              return true;
            }
          } else {
            if (currentTime >= openingTime || currentTime <= closingTime) {
              return true;
            }
          }
        }
      }
    }

    return false;
  };