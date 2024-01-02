import { useDispatch } from "react-redux";
import { isStoreOpenSwitch } from "../../redux/actions";

export default function isStoreOpen(dias, horarios)  {

    const diasSemana = [
      "lunes",
      "martes",
      "miercoles",
      "jueves",
      "viernes",
      "sabado",
      "domingo",
    ];

    const now = new Date();
    const currentDay = diasSemana[now.getDay() -1];
    const currentTime = now.getHours() * 100 + now.getMinutes();
  
    const matchDays = dias?.match(/De (\w+) a (\w+)(?: \(excepto (\w+)\))?/i);
    if (matchDays) {
      const primerDia = matchDays[1].toLowerCase();
      const ultimoDia = matchDays[2].toLowerCase();
      const diaExcluido = matchDays[3] ? matchDays[3].toLowerCase() : undefined;
    


      const primerDiaIndex = diasSemana.indexOf(primerDia);
      const ultimoDiaIndex = diasSemana.indexOf(ultimoDia);
  
      if (primerDiaIndex !== -1 && ultimoDiaIndex !== -1) {
        if (now.getDay() >= primerDiaIndex && now.getDay() <= ultimoDiaIndex) {
  
          if (diaExcluido && currentDay === diaExcluido) {
            return false;
          }
  
          const openingTime = parseInt(horarios.horario_de_apertura.replace(':', ''), 10);
          const closingTime = parseInt(horarios.horario_de_cierre.replace(':', ''), 10);
          
          if (openingTime <= closingTime) {
            if (currentTime >= openingTime && currentTime <= closingTime) {
              return true;
            }
          } else {
            if (currentTime >= openingTime || currentTime <= closingTime) {
              return true;
            }
          }
          
          if (horarios.horario_de_apertura2 && horarios.horario_de_cierre2) {
            const openingTime2 = parseInt(horarios.horario_de_apertura2.replace(':', ''), 10);
            const closingTime2 = parseInt(horarios.horario_de_cierre2.replace(':', ''), 10);
          
            if (openingTime2 <= closingTime2) {
              if (currentTime >= openingTime2 && currentTime <= closingTime2) {
                return true;
              }
            } else {
              if (currentTime >= openingTime2 || currentTime <= closingTime2) {
                return true;
              }
            }
          }
        }
      }
    }
    return false;
  };
