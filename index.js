require('dotenv').config();

const { 
    inquirerMenu, 
    pausa, 
    leerInput, 
    listarLugares
} = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');

const main = async() => {
    const busquedas = new Busquedas();
    let opt;
    
    do {

        //Crear menú de opciones
        opt = await inquirerMenu();

        //Validar opción seleccionadada desde la terminal
        switch (opt) {
            case 1:
                //Buscar ciudad
                const terminos = await leerInput('Ciudad: ');
                const lugares = await busquedas.ciudad(terminos);
                
                //Si obtengo el 0, salgo del Switch
                const id = await listarLugares(lugares);
                if(id === '0') continue;

                const lugarSel = lugares.find(l => l.id === id );

                //Guardar en DB historial
                busquedas.agregarHistorial(lugarSel.nombre);

                //Buscar clima de la ciudad seleccionada (Por Latitud y Longitud)
                const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);

                //Mostrar resultados
                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad:', lugarSel.nombre.green);
                console.log('Latitud: ', lugarSel.lat);
                console.log('Longitud: ', lugarSel.lng);
                console.log('Temperatura: ', clima.temp);
                console.log('Mínima: ', clima.min);
                console.log('Máxima: ', clima.max);
                console.log('Estado actual: ', clima.desc.green);
            break;
            
            case 2:
                //Mostrar historial
                busquedas.historialCapitalizado.forEach((lugar, i) => {
                    const idx = `${ i + 1 }.`.green;
                    console.log(`${ idx } ${ lugar }`)
                });
            break;    
        }
                
        await pausa();
    
    }while(opt !== 0);
}

main();