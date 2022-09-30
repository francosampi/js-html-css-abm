//CLASES
class Persona {
    id = "";
    nombre = "";
    apellido = "";
    edad = 15;

    constructor(_id, _nombre, _apellido, _edad) {
        this.id=_id;
        this.nombre=_nombre;
        this.apellido=_apellido;
        this.edad=_edad>15?_edad:16;
    }
}

class Heroe extends Persona{
    alterego="";
    ciudad="";
    publicado=1941;

    constructor(_id, _nombre, _apellido, _edad, _alterego, _ciudad, _publicado)
    {
        super(_id, _nombre, _apellido, _edad);
        this.alterego=_alterego==null?"":_alterego;
        this.ciudad=_ciudad==null?"":_ciudad;
        this.publicado=_publicado>1940?_publicado:1941;
    }
}

class Villano extends Persona{
    enemigo="";
    robos=0;
    asesinatos=0;

    constructor(_id, _nombre, _apellido, _edad, _enemigo, _robos, _asesinatos)
    {
        super(_id, _nombre, _apellido, _edad);
        this.enemigo=_enemigo==null?"":_enemigo;
        this.robos=_robos>0?_robos:1;
        this.asesinatos=_asesinatos>0?_asesinatos:1;
    }
}

//DATOS
let datosJson='[{"id":1, "nombre":"Clark", "apellido":"Kent", "edad":45, "alterego":"Superman", "ciudad":"Metropolis","publicado":2002},{"id":2, "nombre":"Bruce", "apellido":"Wayne", "edad":35, "alterego":"Batman", "ciudad":"Gotica","publicado":20012},{"id":3, "nombre":"Bart", "apellido":"Alen", "edad":30, "alterego":"Flash", "ciudad":"Central","publicado":2017},{"id":4, "nombre":"Lex", "apellido":"Luthor", "edad":18, "enemigo":"Superman", "robos":500,"asesinatos":7},{"id":5, "nombre":"Harvey", "apellido":"Dent", "edad":20, "enemigo":"Batman", "robos":750,"asesinatos":2},{"id":666, "nombre":"Celina", "apellido":"kyle", "edad":23, "enemigo":"Batman", "robos":25,"asesinatos":1}]';
const datos=JSON.parse(datosJson);
let personas = [];
let personasFiltradas = [];
let btnAgregar;

//FORM
const btnCalcular=document.getElementById("form_datos_btnCalcular");
const form=document.getElementById("form_datos");
const formEdadPromedio=document.getElementById("form_datos_edadPromedio");
let ultimoId=datos.length;

//FILTROS Y TABLA
let formTabla;
let indiceSort=1;
const formFiltro=document.getElementById("form_datos_filtro");
const formFiltrosTabla=document.getElementById("form_datos_filtrosTabla");

for(cbox of document.getElementsByClassName('form_datos_cbox'))
{
    cbox.addEventListener("change", function(){
        generarTabla();
    });
}

//ABM
const abm=document.getElementById("form_abm");
//ABM - INPUTS
const abmInputId=document.getElementById("input_id")
const abmInputNombre=document.getElementById("input_nombre")
const abmInputApellido=document.getElementById("input_apellido")
const abmInputEdad=document.getElementById("input_edad");
const abmInputTipo=document.getElementById("input_tipo");
const abmInputAlterEgo=document.getElementById("input_alterego");
const abmInputCiudad=document.getElementById("input_ciudad");
const abmInputPublicado=document.getElementById("input_publicado");
const abmInputEnemigo=document.getElementById("input_enemigo");
const abmInputRobos=document.getElementById("input_robos");
const abmInputAsesinatos=document.getElementById("input_asesinatos");
//ABM - BOTONES
const abmAgregar=document.getElementById("form_abm_btnAgregar");
const abmModificar=document.getElementById("form_abm_btnModificar");
const abmEliminar=document.getElementById("form_abm_btnEliminar");
const abmCancelar=document.getElementById("form_abm_btnCancelar");

//PARSEAR DATOS
datos.forEach(persona => {
    let datos=[
        persona.id,
        persona.nombre,
        persona.apellido,
        persona.edad
    ];

    if (persona.hasOwnProperty('alterego'))
        personas.push(new Heroe(...datos, persona.alterego, persona.ciudad, persona.publicado));
    else if(persona.hasOwnProperty('enemigo'))
        personas.push(new Villano(...datos, persona.enemigo, persona.robos, persona.asesinatos));
    else
        personas.push(new Persona(...datos));
});

generarTabla();

function generarTabla(){
    let opcion=formFiltro.selectedIndex;

    formFiltrosTabla.style.display="";
    document.getElementById('form_datos_tabla').remove();
    formTabla = document.createElement('table');
    formTabla.id='form_datos_tabla';

    //HEAD Y BODY DE TABLA
    let thead = document.createElement('thead');
    let tbody = document.createElement('tbody');

    formTabla.appendChild(thead);
    formTabla.appendChild(tbody);

    let arrBotonesOrden=[];

    for(cbox of document.getElementsByClassName('form_datos_cbox'))
    {
        if (cbox.checked)
        {
            let head = document.createElement('th');
            let boton_orden = document.createElement('button');
            boton_orden.innerHTML=cbox.name;
            boton_orden.setAttribute("id", "orden_"+boton_orden.innerHTML);
            arrBotonesOrden.push(boton_orden);

            head.appendChild(boton_orden);
            thead.appendChild(head);
        }
    }

    //FILTRAR POR TIPO DE PERSONA
    personasFiltradas = personas.filter(elemento=>{
        return (opcion==0 || (elemento instanceof Heroe && opcion==1) || (elemento instanceof Villano && opcion==2));
    });

    asignarEventoOrden(arrBotonesOrden);

    //ESCRIBIR EN LA TABLA
    personasFiltradas.forEach(persona => {
        let tr = document.createElement('tr');
            
        escribirTd('id', persona.id);
        escribirTd('nombre', persona.nombre);
        escribirTd('apellido', persona.apellido);
        escribirTd('edad', persona.edad);
        escribirTd('alterego', persona.alterego);
        escribirTd('ciudad', persona.ciudad);
        escribirTd('publicado', persona.publicado);
        escribirTd('enemigo', persona.enemigo);
        escribirTd('robos', persona.robos);
        escribirTd('asesinatos', persona.asesinatos);

        //DOBLE CLICK PARA TRAER ID DE PERSONA
        tr.setAttribute("id", persona.id);
        tr.addEventListener("dblclick", ()=>{
            personas.forEach(persona => {
                if (persona.id==tr.id)
                    abrirAbm("modificar", persona);
            });
        });

        function escribirTd(_propStr, _prop){
            if (document.getElementById(`cbox_${_propStr}`).checked)
            {
                td = document.createElement('td');
                td.innerHTML = (persona.hasOwnProperty(_propStr))?_prop:'--';
                tr.appendChild(td);
            }
        }
        formTabla.appendChild(tr);
    });

    //BOTON AGREGAR NUEVO REGISTRO
    btnAgregar=document.createElement('button');
    btnAgregar.innerHTML='Agregar';
    btnAgregar.id='btnAgregar';
    btnAgregar.addEventListener("click", ()=>{
        abrirAbm("alta");
    });
    formTabla.appendChild(btnAgregar);
    document.getElementById("seccion_tabla").appendChild(formTabla);
}

//GENERAR TABLA AL CAMBIAR FILTRO
formFiltro.addEventListener("change", ()=>{
    generarTabla();
});

//RELLENAR DATOS ABM
function rellenarAbm(persona){
    abmInputNombre.value=persona.nombre==undefined?"":persona.nombre;
    abmInputApellido.value=persona.apellido==undefined?"":persona.apellido;
    abmInputEdad.value=persona.edad==undefined?"":persona.edad;
    
    if (persona instanceof Heroe)
        abmInputTipo.selectedIndex=0;
    else if (persona instanceof Villano)
        abmInputTipo.selectedIndex=1;

    abmInputAlterEgo.value=persona.alterego==undefined?"":persona.alterego;
    abmInputCiudad.value=persona.ciudad==undefined?"":persona.ciudad;
    abmInputPublicado.value=persona.publicado==undefined?"":persona.publicado;
    abmInputEnemigo.value=persona.enemigo==undefined?"":persona.enemigo;
    abmInputRobos.value=persona.robos==undefined?"":persona.robos;
    abmInputAsesinatos.value=persona.asesinatos==undefined?"":persona.asesinatos;
}

//HABILITAR O NO LOS INPUT DEL ABM
function ajustarAbmSegunTipo() {
    let boolHeroe = abmInputTipo.selectedIndex==0;
    let boolVillano = abmInputTipo.selectedIndex==1;

    //HEROE
    abmInputAlterEgo.disabled=!boolHeroe;
    abmInputCiudad.disabled=!boolHeroe;
    abmInputPublicado.disabled=!boolHeroe;

    //VILLANO
    abmInputEnemigo.disabled=!boolVillano;
    abmInputRobos.disabled=!boolVillano;
    abmInputAsesinatos.disabled=!boolVillano;
}

//DESHABILITO INPUTS SEGUN TIPO DE PERSONA
abmInputTipo.addEventListener("change", ()=>{
    ajustarAbmSegunTipo();
});

//ABRIR TABLA REGISTROS
function abrirTabla(){
    abm.style.display="none";
    form.style.display="";
    formTabla.style.display="";
    generarTabla();
}

//ABRIR ABM - OPERACIONES
function abrirAbm(_operacion, persona){
    abm.style.display="";
    form.style.display="none";
    formTabla.style.display="none";
    
    if (!persona instanceof Persona)
        return;

    switch(_operacion)
    {
        case "alta":
            abmInputId.value=ultimoId+1;
            abmInputId.disabled=false;
            abmAgregar.disabled=false;
            abmModificar.disabled=true;
            abmEliminar.disabled=true;
            rellenarAbm(new Persona);
        break;
        case "modificar":
        case "eliminar":
            abmInputId.value=persona.id;
            abmInputId.setAttribute("id", persona.id);
            abmInputId.disabled=true;
            abmAgregar.disabled=true;
            abmModificar.disabled=false;
            abmEliminar.disabled=false;
            rellenarAbm(persona);
        break;
    }
    ajustarAbmSegunTipo();
}

//CALCULAR EDAD PROMEDIO
btnCalcular.addEventListener("click", ()=>{
    let totalEdad=personasFiltradas.reduce((edadTotal, persona)=>{
        return edadTotal += persona.edad;
    }, 0);
    formEdadPromedio.value=(totalEdad/=personasFiltradas.length).toFixed(2);
});

//ABM - OPERACIONES
abmAgregar.addEventListener("click", ()=>{
    if (!datosValidados())
        return;

    if(confirm("Desea agregar nuevo registro?"))
    {
        ultimoId++;
        personas.push(crearPersonaAbm());
        abrirTabla();
    }
});

abmModificar.addEventListener("click", ()=>{
    if (!datosValidados())
        return;

    let persona;
    const idPersona=abmInputId.id;

    personas.forEach(item => {
        if (item.id==idPersona)
            persona=item;
    });

    if(confirm("Desea modificar este registro? ID: "+idPersona))
    {
        const index=personas.indexOf(persona);
        if (~index)
            personas[index]=crearPersonaAbm();
        abrirTabla();
    }
});

abmEliminar.addEventListener("click", ()=>{
    let persona;
    const idPersona=abmInputId.id;

    personas.forEach(item => {
        if (item.id==idPersona)
            persona=item;
    });

    if(confirm("Desea borrar este registro? ID: "+idPersona))
    {
        const index = personas.indexOf(persona);
        if (~index)
            personas.splice(index, 1);
        abrirTabla();
    }
});

abmCancelar.addEventListener("click", abrirTabla);

//VALIDAR INPUTS ABM DONDE CORRESPONDA (REGEX)
function datosValidados(){
    const soloLetras=/^[A-Za-z\s]+$/;

    return(
        abmInputNombre.value.match(soloLetras) &&
        abmInputApellido.value.match(soloLetras) &&
        (!isNaN(abmInputEdad.value)) &&
        (abmInputAlterEgo.disabled ? true : abmInputAlterEgo.value.match(soloLetras)) &&
        (abmInputCiudad.disabled ? true : abmInputCiudad.value.match(soloLetras)) &&
        (abmInputPublicado.disabled ? true : (!isNaN(abmInputPublicado.value) && parseInt(abmInputPublicado.value)>1950)) &&
        (abmInputEnemigo.disabled ? true : abmInputEnemigo.value.match(soloLetras)) &&
        (abmInputRobos.disabled ? true : (!isNaN(abmInputRobos.value) && parseInt(abmInputRobos.value)>-1)) &&
        (abmInputAsesinatos.disabled ? true : (!isNaN(abmInputAsesinatos.value) && parseInt(abmInputAsesinatos.value)>-1))
    );
}

//RETORNAR UNA PERSONA CREADA POR ABM
function crearPersonaAbm() {
    let datos=[
        parseInt(abmInputId.value),
        abmInputNombre.value.trim(),
        abmInputApellido.value.trim(),
        parseInt(abmInputEdad.value)
    ];
    capitalizarString(datos);

    if (abmInputTipo.selectedIndex==0)
    {
        let datosHeroe=[
            abmInputAlterEgo.value.trim(),
            abmInputCiudad.value.trim(),
            parseInt(abmInputPublicado.value)
        ];
        capitalizarString(datosHeroe);

        return new Heroe(...datos, ...datosHeroe);
    }
    else if (abmInputTipo.selectedIndex==1)
    {
        let datosVillano=[
            abmInputEnemigo.value.trim(),
            parseInt(abmInputRobos.value),
            parseInt(abmInputAsesinatos.value)
        ];
        capitalizarString(datosVillano);

        return new Villano(...datos, ...datosVillano);
    }
    return new Persona(...datos);
}

//USAR MAP PARA CAPITALIZAR STRINGS
function capitalizarString(_arr){
    _arr.map((elemento, indice)=>{
        if (typeof _arr[indice] === 'string')
            _arr[indice]=_arr[indice].charAt(0).toUpperCase()+_arr[indice].slice(1);
    });
}

//ASIGNAR EL EVENTO DE ORDENAMIENTO A CADA BOTON
function asignarEventoOrden(_arr){
    for(let i=0;i<_arr.length;i++){
        _arr[i].addEventListener('click', ()=>{
            personas.sort((a, b) => {
                let paramA = [a.id,a.nombre,a.apellido,a.edad,a.alterego,a.ciudad,a.publicado,a.enemigo,a.robos,a.asesinatos];
                let paramB = [b.id,b.nombre,b.apellido,b.edad,b.alterego,b.ciudad,b.publicado,b.enemigo,b.robos,b.asesinatos];
                
                if(paramA[i]){
                    if (paramA[i] > paramB[i])
                        return 1*indiceSort;
                    else if (paramA[i] == paramB[i])
                        return 0;
                    return -1*indiceSort;
                }
            });
            indiceSort=-indiceSort;
            generarTabla();
        });
    }
}