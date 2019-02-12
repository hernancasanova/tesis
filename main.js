$(document).ready(function(){
	$("#img1").tooltipster({
		animation: 'fade',
   		delay: [5,1500],
   		interactive: true,
	});
	var pga=new Array();
	var pestudios=new Array();//plan de estudios para almacenar todos los nombres de las asignaturas
	var b=0;
	var pgp=[4.81,4.75,4.58,3.82,4.54];//obtenido desde infoalumnos
	//var pgp=[1,2,3,4,5,6,7];//obtenido desde infoalumnos
	var pga=[4.81,4.37,4.43,4.21,4.49];//obtenido desde infoalumnos
	
	function cargaSimbologiaAreas(){
		$("#SimbolAreas").append($("<div/>",{id:"especialidad"})).append("Área de Formación de la Especialidad");
		$("#SimbolAreas").append($("<div/>",{id:"general"})).append("Área de Formación General");
		$("#SimbolAreas").append($("<div/>",{id:"vinculante"})).append("Área de Formación Vinculante");
		$("#SimbolAreas").append($("<div/>",{id:"optativa"})).append("Área de Formación Optativa");
	}
	function requisitos(nameCourse){
		$.getJSON("ProgramStructure.json", function(data,error){
			for (var w = 1; w <=69; w++) {
				$("#"+w).css({"opacity":".5"});
			}
			for (var program in data) {	
				var flag=0;
				var nTerms=data[program].terms.length;
				for (var i = 0; i < nTerms; i++) {
					var nCourses=data[program].terms[i].courses.length;
					for (var j = 0; j < nCourses; j++) {//Numero de cursos en el semestre indicado
						if(data[program].terms[i].courses[j].name==nameCourse){
							var Nrequisites=data[program].terms[i].courses[j].requisites.length;
							var credits=data[program].terms[i].courses[j].credits;
							for (var k = 0; k < Nrequisites; k++) {//Requisitos de la  asignatura
								var requirement=data[program].terms[i].courses[j].requisites[k];
								for (var l = 1; l <=69; l++) {
									if(pestudios[l-1]==nameCourse&&flag==0){
										$("#"+l).removeClass("cursoSeleccionado");
									    $("#"+l).removeClass("course");
									    $("#"+l).removeClass("courseReq");
										$("#"+l).addClass("DesempCurso").append($("<input/>",{class:"btnCredit",value:credits,title:"créditos",disabled:"disabled"}));
										$("#"+l).css({"opacity":""});
										flag=1;
									}
									if (pestudios[l-1]==requirement) {
										$("#"+l).removeClass("cursoSeleccionado");
									    $("#"+l).removeClass("course");
									    $("#"+l).removeClass("DesempCurso");
										$("#"+l).css({"opacity":""});
										$("#"+l).addClass("courseReq").append($("<input/>",{class:"btnreq",value:"Req",title:"requisito",disabled:"disabled"}));
									}
								}
							}
						}
					}
				}
			}
		});
	}
	//CARGA DE DATOS Y ASIGNACIÓN DE NOTAS A ASIGNATURAS YA CURSADAS
	function cargarDatos(){
		$.getJSON("student.json", function(data,error){	
			for (var i = 0; i < b; i++) {
				$("#btn"+i).removeClass("botonSelec");
				$("#btn"+i).removeClass("botonSelecPerCurs");
			}		
            var pga=new Array();
            var repeticiones=new Array();
        	for (var i = 1; i <= 69; i++) {
        		repeticiones[i]=0;
        		$("#"+i).css({"opacity":""});
        		$("#"+i).removeClass("cursoSeleccionado");
        		$("#"+i).removeClass("DesempCurso");
        		$("#"+i).removeClass("courseReq");
        		$("#"+i).addClass("course");
        		$("#"+i).text("");
        		$("#"+i).append(pestudios[i-1]);
        	}
			//FOR PARA ASIGNAR LAS NOTAS DE TODAS LAS ASIGNATURAS YA CURSADAS. 
			for (var CantSem in data) {
				var nameStudent=data[CantSem].name;
				var cityStudent=data[CantSem].city;
				var emailStudent=data[CantSem].email;
				var programName=data[CantSem].programName;
				var version=data[CantSem].startYear;
				$("#tooltip_content").html("Nombre estudiante: "+nameStudent+"<br>Año de ingreso: "+version+"<br>Ciudad procedencia: "+cityStudent+"<br>Email: <a href='https://outlook.com/alumnos.uach.cl'>"
					+emailStudent+"</a><br>Plan de estudios: "+programName+"<br>Versión plan de estudios: "+version);
			    var NSemestres=data[CantSem].courseTaken.length;//Numero de semestres cursados por el estudiante
			    for (var i = 0; i < NSemestres; i++) {
			    	var Cursos=new Array();
			    	var Notas=new Array();
	        		var curso;
	        		var PGA=0;
	        		var Periodo=data[CantSem].courseTaken[i].semester+" "+data[CantSem].courseTaken[i].year;
	        		var stateSemester=data[CantSem].courseTaken[i].state;
	        		var Nasignaturas=data[CantSem].courseTaken[i].Courses.length;//numero de asignaturas en el semestre correspondiente
		        	if (stateSemester=="cursed") {
		        		for (var j = 0; j < Nasignaturas; j++) {
			            	var notaAprob=data[CantSem].courseTaken[i].Courses[j].gradeAprobation;
			            	curso=data[CantSem].courseTaken[i].Courses[j].nombre;
			            	nota=data[CantSem].courseTaken[i].Courses[j].grade;
			            	var statusCourse=data[CantSem].courseTaken[i].Courses[j].status;
			            	Cursos.push(curso);
		                	Notas.push(nota);
		                	PGA=PGA+(nota/Nasignaturas);
			                for (var k = 1; k <= 69; k++) {
			                	if (Cursos[j]==pestudios[k-1]) {
			                		if(statusCourse=="passed"){
				                		if((Notas[j]>=notaAprob) || (Notas[j]==0)){
				                			$("#"+k).removeClass("cursoSeleccionado");
				                			$("#"+k).addClass("course");
				                			$("#"+k).text("");
				                			if(Notas[j]!=0){$("#"+k).append($("<input/>",{class:"btnAprob",value:Notas[j].toFixed(1),disabled:"disabled"})).append(pestudios[k-1]);}
				                			else{$("#"+k).append($("<input/>",{class:"btnAprob",value:Notas[j],disabled:"disabled"})).append(pestudios[k-1]);}
				                			break;
				                		}
				                		else{
				                			repeticiones[k]=repeticiones[k]+1;
				                			$("#"+k).removeClass("cursoSeleccionado");
				                			$("#"+k).addClass("course");
				                			$("#"+k).text("");
				                			if (repeticiones[k]==1) {$("#"+k).append($("<input/>",{class:"btnReprob",value:Notas[j].toFixed(1),disabled:"disabled"})).append(pestudios[k-1]+"  ");}
				                			else{$("#"+k).append($("<input/>",{class:"btnrepe",value:repeticiones[k],disabled:"disabled",title:"número repeticiones"})).append(pestudios[k-1]+"  ");}
				                			break;
				                		}
			                		}
			                		else{
				                		$("#"+k).removeClass("cursoSeleccionado");
				                		$("#"+k).addClass("course");
				                		if (statusCourse=="anuled-student") {$("#"+k).append($("<input/>",{class:"btnAnula",value:"Anul-A",disabled:"disabled",title:"anulado por alumno"}));}
				                		else{$("#"+k).append($("<input/>",{class:"btnAnula",value:"Anul-E",disabled:"disabled",title:"anulado por escuela"}));}
				                		break;
		                			}
			                	}
			                }
		            	}
	            	}
	            	else{//SI EL SEMESTRE FUE ANULADO
	            		for (var m = 0; m < b; m++) {
	            			if($("#btn"+m).attr("value")==Periodo){
	            				$("#btn"+m).removeClass("boton");
	            				$("#btn"+m).addClass("botonSemAnulado").attr("disabled","disabled").attr("title","Semestre anulado");
	            			}
	            		}
	            	}
			    }
			}
	    });  //fin de la carga del archivo student.json
	}//fin de la función cargarDatos
	function cargaGraficaCurso(cursoid,sem){
		$.getJSON("student.json", function(data,error){
			for(var k=0;k<b;k++){
				$("#btn"+k).removeClass("botonSelecPerCurs");
				$("#btn"+k).removeClass("botonSelec");
			}
			var idcurso=$(cursoid).attr("id");
			var notas=new Array();
			var distrNotas=new Array();
			for (var program in data) {
				var NSemestres=data[program].courseTaken.length;//Numero de semestres cursados por el estudiante
				for (var i = 0; i < NSemestres; i++) {
					if(sem==""){//cuando se hace click en un curso que no esta cursado en el periodo clickeado
						var Nasignaturas=data[program].courseTaken[i].Courses.length;//numero de asignaturas en el semestre correspondiente
						for (var j = 0; j < Nasignaturas; j++) {
							var per=data[program].courseTaken[i].semester+" "+data[program].courseTaken[i].year;//periodo
							if ((data[program].courseTaken[i].Courses[j].nombre==pestudios[idcurso-1])&&data[program].courseTaken[i].Courses[j].status=="passed") {
								notas.push(data[program].courseTaken[i].Courses[j].grade);
								var nota=d3.max(notas);
								distrNotas.push(data[program].courseTaken[i].Courses[j].distributiongrades);
								for (var k = 0; k < b; k++) {
									if ($("#btn"+k).attr("value")==per) {
										$("#btn"+k).addClass("botonSelecPerCurs");
									}
								}
							}	
						}
					}
					else{//cuando se hace click en un curso dentro del periodo seleccionado
						var Nasignaturas=data[program].courseTaken[i].Courses.length;//numero de asignaturas en el semestre correspondiente
						for (var j = 0; j < Nasignaturas; j++) {
							var per=data[program].courseTaken[i].semester+" "+data[program].courseTaken[i].year;//periodo
							if ((data[program].courseTaken[i].Courses[j].nombre==pestudios[idcurso-1])&&data[program].courseTaken[i].Courses[j].status=="passed"&&per==sem) {
								var nota=data[program].courseTaken[i].Courses[j].grade;
								var notaAprob=data[program].courseTaken[i].Courses[j].gradeAprobation;
								$("#"+idcurso).text("");
								if (nota>=notaAprob||nota==0) {
									if(nota!=0){$("#"+idcurso).append(pestudios[idcurso-1]).append($("<input/>",{class:"btnAprob",value:nota.toFixed(1),disabled:"disabled"}));}
				                	else{$("#"+idcurso).append(pestudios[idcurso-1]).append($("<input/>",{class:"btnAprob",value:nota,disabled:"disabled"}));}
								}
								else{
									$("#"+idcurso).append(pestudios[idcurso-1]+"  ").append($("<input/>",{class:"btnReprob",value:nota.toFixed(1),disabled:"disabled"}));
								}
								distrNotas.push(data[program].courseTaken[i].Courses[j].distributiongrades);
								for (var k = 0; k < b; k++) {
									if ($("#btn"+k).attr("value")==per) {
										$("#btn"+k).addClass("botonSelecPerCurs");
									}
								}	
							}
						}
					}
				}
			}
			if(distrNotas.length>0){
				$(cursoid).addClass("DesempCurso");
				var svg=d3.select(cursoid).append("svg");//.attr("fill","white");
				var escalaNotas=[1,2,3,4,5,6,7];//notas eje x
				svg.attr("width",85)
				.attr("height",55);//7 centimetros para el espacio entre las graficas comparativas
				var width = 80,//ancho de la grafica
				height = 50;
			  	var x = d3.scale.ordinal().rangeRoundBands([0, width],.05);
			  	var y = d3.scale.ordinal().rangeRoundBands([height, 0],.05);
			  	x.domain(["10-19","20-29","30-39","40-49","50-59","60-70"]);
				y.domain([1,2,3,4,5,6,7]);
				var xAxis = d3.svg.axis()
			    .scale(x)
			    .orient("bottom");
				var yAxis = d3.svg.axis()
				.scale(y)
				.orient("left");
				svg.append("g")
			    .attr("class", "x axis")
			    .attr("transform", "translate(3,40)")
			    .attr("font-size","5px")
			    .call(xAxis)
			    .append("text")
			    .attr("transform","translate(120,15)") 
			    .attr("text-anchor", "end")
			    .attr("dy", "-.55em")
			    .attr("font-size","7px")
			    .text("Escala notas");
			    
			  	svg.append("text").attr("font-size","8px").attr("transform","translate(3,6)").text("Curso");
			  	svg.selectAll(".bar")
				.data(escalaNotas)
				.enter().append("rect")
				.attr("class", "bar")
				.attr("fill",function(d,i){if ((escalaNotas[i]<=nota)&&(nota<escalaNotas[i+1])){
					if (nota>=4.0) {return "green";}else{return "red";}
					}else{return "black";}
				})
				.attr("rx",2)
				.attr("ry",2)
				.attr("transform", "translate(0,-5)")
				.attr("x",function(d,i) { return x(escalaNotas[i])+6; } )
				.attr("width", "5px")
				.attr("y",function(d,i) {
				 return y(distrNotas[distrNotas.length-1][i]); } )
				.attr("height", function(d,i) {return height - y(distrNotas[distrNotas.length-1][i])-5; });
			}
		});	
	}//FIN DE LA FUNCION cargaGraficaCurso

	function cargaGraficaCursoHist(cursoid){
		$.getJSON("ProgramStructure.json", function(data,error){
			var idcurso=$(cursoid).attr("id");
			var svg=d3.select(cursoid).append("svg");
			for (var program in data) {
				var nTerms=data[program].terms.length;
				for (var i = 0; i < nTerms; i++) {
					var nCourses=data[program].terms[i].courses.length;
					for (var j = 0; j < nCourses; j++) {
						var Area=data[program].terms[i].courses[j].area;
						if (data[program].terms[i].courses[j].name==pestudios[idcurso-1]) {
							var historic=data[program].terms[i].courses[j].historic;
							svg.append("rect").attr("width","100%").attr("height","100%").attr("fill","transparent");//.attr("rx",5).attr("ry",5).attr("opacity",.9);//.attr("fill",colors[k]);
						}
					}
				}
			}
			var escalaNotas=[2,3,4,5,6,7];//notas eje x
		    var cantidad=[1,1,5,6,3,2];//altura de barras
			svg.attr("width",85)
			.attr("height",55);//7 centimetros para el espacio entre las graficas comparativas
			var width = 80,//ancho de la grafica
			height = 50;
		  	var x = d3.scale.ordinal().rangeRoundBands([0, width],.05);
		  	var y = d3.scale.ordinal().rangeRoundBands([height, 0],.05);
		  	x.domain(["10-19","20-29","30-39","40-49","50-59","60-70"]);
			y.domain([1,2,3,4,5,6]);
			var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom");
			var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left");
			svg.append("g")
		    .attr("class", "x axis")
		    .attr("transform", "translate(3,40)")
		    .attr("font-size","5px")
		    .call(xAxis);
		    svg.append("text").attr("font-size","8px").attr("transform","translate(3,15)").text("Histórico");

		    
		  	svg.selectAll(".bar")
			.data(escalaNotas)
			.enter().append("rect")
			.attr("class", "bar")
			.attr("rx",2).attr("ry",2)
			.attr("transform", "translate(0,-5)")
			.attr("x",function(d,i) { return x(escalaNotas[i])+6; } )
			.attr("width", "5px")
			.attr("opacity",".9")
			.attr("y",function(d,i) {
			 return y(historic[i]); } )
			.attr("height", function(d,i) {return height - y(historic[i])-5; });
		});	
	}//FIN DE LA FUNCION cargaGraficaCursoHist
	//carga del plan de estudios
	var semestres=["SEMESTRE I","SEMESTRE II","SEMESTRE III","SEMESTRE IV","SEMESTRE V","SEMESTRE VI","SEMESTRE VII","SEMESTRE VIII","SEMESTRE IX","SEMESTRE X","SEMESTRE XI","SEMESTRE XII"];
	$.getJSON("ProgramStructure.json", function(data,error){
		for (var program in data) {
			var titulo=data[program].programName.slice(10);
			var idCurso=1;
			var nTerms=data[program].terms.length;
			for (var i = 0; i < nTerms; i++) {
				var idSem=data[program].terms[i].position;
				if(i==4){$("#pestudios").append($("<div/>",{class:"ciclo"}).append("BACHILLERATO EN CIENCIAS DE LA INGENIERÍA"));}
				$("#pestudios").append($("<div/>",{class:"semestre",id:"s"+idSem}).html("<center>"+semestres[i]+"</center>")).css({"font-size":"14px","font-weight":"bold"});
				if(i==7){$("#pestudios").append($("<div/>",{class:"ciclo"}).append("LICENCIATURA EN CIENCIAS DE LA INGENIERÍA"));}
				if(i==10){$("#pestudios").append($("<div/>",{class:"ciclo"}).append("TÍTULO PROFESIONAL INGENIERO/A "+titulo.toUpperCase()));}
				var nCourses=data[program].terms[i].courses.length;
				var Area;
				for (var j = 0; j < nCourses; j++) {
					Area=data[program].terms[i].courses[j].area;
					if(Area=="especialidad"){
						$("#s"+idSem).append($("<div/>",{class:"course",id:idCurso}).css({"background":"#0174DF"}));
					}
					if(Area=="vinculante"){
						//$("#s"+idSem).append($("<div/>",{class:"course",id:idCurso}).css({"background":"#DF3A01"}));
						$("#s"+idSem).append($("<div/>",{class:"course",id:idCurso}).css({"background":"#FE642E"}));
					}
					if(Area=="optativa"){
						//$("#s"+idSem).append($("<div/>",{class:"course",id:idCurso}).css({"background":"green"}));
						$("#s"+idSem).append($("<div/>",{class:"course",id:idCurso}).css({"background":"#2EFE2E"}));
					}
					if(Area=="general"){
						$("#s"+idSem).append($("<div/>",{class:"course",id:idCurso}).css({"background":"#FE2E2E"}));
						//$("#s"+idSem).append($("<div/>",{class:"course",id:idCurso}).css({"background":"red"}));
					}
					idCurso++;	
				}
			}
		}
		//ACCIONES QUE SE REALIZAN CUANDO SE PRESIONA UN CURSO
		$(".course").click(function(){
			d3.selectAll("circle").attr("fill",function(d,i){
				if (i>=pgp.length) {return "steelblue";}
				else{return "red";}
			});
			var cursoid=$(this).attr('id');
			var nameCourse=pestudios[cursoid-1];
			var sem="";
			cargarDatos();
			for (var j = 1; j <=69; j++) {
				if (pestudios[j-1]==nameCourse) {
					if ($(this).hasClass("cursoSeleccionado")) {
						for (var i = 0; i < b; i++) {
							if ($("#btn"+i).hasClass("botonSelec")) {//para determinar en que periodo se curso la asignatura clickeada
								var sem=$("#btn"+i).attr("value");
								cargaGraficaCurso(this,sem);
							}
						}
					}
					else{
						cargaGraficaCurso(this,sem);
					}
					cargaGraficaCursoHist(this);
					requisitos(nameCourse);
				}
				else{
					$("#"+j).css({"opacity":".5"});
				}
			}
			if ($(this).hasClass("DesempCurso")) {cargarDatos();}
		});
	});	
	//CARGA DE GRAFICA DEL PGA Y PGP
	function cargaGraficaPGA(PGP,PGA){
		var svg=d3.select("svg");
		var width=1100;
		var height=120;
		var g=d3.select("svg").append("g").attr("id","ContenedorGrafica");
		g.attr("transform","translate(10,10)");
	    var x = d3.scale.ordinal().rangeRoundBands([0, width],0.6);//of
		var y = d3.scale.ordinal().rangeRoundBands([height, 0],1,1);//of
		y.domain(["1.0","2.0","3.0","4.0","5.0","6.0","7.0"]);
		var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");
		var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");//donde se ubica la escala del eje
		g.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(30,105)")
	    .attr("font-size","10px")
	    .call(xAxis)
	    .append("text")
	    .attr("transform","translate(1150,10)") 
	    .attr("text-anchor", "end")
	    .attr("dy", "-.55em")
	    .attr("font-size","10px")
	    .text("Semestre");
	    
	    g.append("g")
	    .attr("class", "y axis")
	    .attr("transform", "translate(30,0)")//of
	    .attr("font-size","8px")
	  	.call(yAxis)
	  	.append("text")
	  	.attr("transform", "translate(75,0)")
	  	.attr("y", 6)
	  	.attr("dy", ".71em")
	  	.style("text-anchor", "end")
	  	.attr("font-size","10px")
	  	.text("Escala de notas");
		

	  	//LINEA QUE UNE LOS PUNTOS DEL PGA
		g.selectAll(".circle")
		.data(PGA)
		.enter().append("line")
		.attr("x1",function(d,i){return 59+60*(i); })
		.attr("y1",function(d,i){return 105- 15*(PGA[i]-1);})
		.attr("x2",function(d,i){if(PGA[i+1]){return 59+60*(i+1);}else{return 59+60*(i);}})
		.attr("y2",function(d,i){if(PGA[i+1]){return 105- 15*(PGA[i+1]-1);}else{return 105- 15*(PGA[i]-1);}})
		.attr("stroke-width",2)
		.attr("stroke","red");

		
		//LINEA QUE UNE LOS PUNTOS DEL PGP
		g.selectAll(".circle")
		.data(PGP)
		.enter().append("line") 
		.attr("x1",function(d,i){return 59+60*(i); })
		.attr("y1",function(d,i){return 105- 15*(PGP[i]-1);})
		.attr("x2",function(d,i){if(PGP[i+1]){return 59+60*(i+1);}else{return 59+60*(i);}})
		.attr("y2",function(d,i){if(PGP[i+1]){return 105- 15*(PGP[i+1]-1);}else{return 105- 15*(PGP[i]-1);}})
		.attr("stroke-width",2)
		.attr("stroke","steelblue");

		var div=d3.select("#pga").append("div")
    	.attr("class","tooltipPGP").style("opacity", 0);
    	var div2=d3.select("#pga").append("div")
    	.attr("class","tooltipPGA").style("opacity", 0);


    	//CIRCULOS PARA EL PGA
		g.selectAll(".circle")
		.data(PGA)
		.enter().append("circle")
		.attr("class","pga")
		.attr("fill","red")
		.attr("r",5)
		.attr("cx",function(d,i) {return 59+60*i; } )
		.attr("cy",function(d,i) {return 105- (PGA[i]-1)*15; })
		.on("mouseover",function(d,i){
			div2.transition()		
                .duration(200)		
                .style("opacity", .9);
			div2.html(PGA[i]).style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");
		})
		.on("mouseout",function(d,i){
			div2.transition()		
                .duration(500)		
                .style("opacity", 0);	
		});




    	//CIRCULOS PARA EL PGP
		g.selectAll(".circle")
		.data(PGP)
		.enter().append("circle")
		.attr("class","pgp")
		.attr("fill","steelblue")
		.attr("r",5)
		.attr("cx",function(d,i) {return 59+60*i; } )
		.attr("cy",function(d,i) {return 105-(PGP[i]-1)*15; })
		.on("mouseover",function(d,i){
			var text=$("#btn"+i).val();
			var id=$("#btn"+i).attr("id");
			botonclickeado(id,text);
			div.transition()		
                .duration(200)		
                .style("opacity", .9);
			div.html(PGP[i]).style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");
		})
		.on("mouseout",function(d,i){cargarDatos();
			div.transition()		
                .duration(500)		
                .style("opacity", 0);
                d3.select(this).attr("fill","steelblue");

		});



		//SIMBOLOGIA DE LOS PUNTOS	
		g.append("ellipse")
		.attr("fill","steelblue")
		.attr("rx",5)
		.attr("ry",5)
		.attr("cx",200)
		.attr("cy",7);
		g.append("text").text("PGP").attr("transform","translate(210,10)");
		g.append("ellipse")
		.attr("fill","red")
		.attr("rx",5)
		.attr("ry",5)
		.attr("cx",330)
		.attr("cy",7);
		g.append("text").text("PGA").attr("transform","translate(340,10)");


	}//fin de la funcion cargaGraficaPGA
	//ACCIONES QUE SE REALIZAN CUANDO SE CLICKEA UN BOTÓN
	function botonclickeado(idBoton,textBoton){
		$.getJSON("student.json", function(data,error){		
			for (var i = 1; i <=69; i++) {
				$("#"+i).text("");
				$("#"+i).css({"opacity":".5"});
				$("#"+i).append(pestudios[i-1]);
				$("#"+i).removeClass("cursoSeleccionado");
				$("#"+i).removeClass("DesempCurso");
				$("#"+i).removeClass("courseReq");
				$("#"+i).addClass("course");
			}
			var semestre=textBoton;
			for (var j = 0; j < pgp.length; j++) {
				if (idBoton=="btn"+j) {
					d3.selectAll("circle").attr("fill",function(d,i){
						if (j+pgp.length==i) {return "#FFFF00";}else{
							if (i>=pgp.length) {return "steelblue";}
							else{return "red";}
						}
					});
				}
			}
			for (var i = 0; i < b; i++) {
				$("#btn"+i).removeClass("botonSelec");
				$("#btn"+i).removeClass("botonSelecPerCurs");
			}
			$("#"+idBoton).addClass("botonSelec");
			
			//SE CARGAN NUEVAMENTE TODAS LAS NOTAS DE LAS ASIGNATURAS CURSADAS POR CADA SEMESTRE

			var repeticiones=new Array();
	    	for (var i = 1; i <= 69; i++) {
	    		repeticiones[i]=0;
	    	}

			for (var Semestre in data) {
				var NSemestres=data[Semestre].courseTaken.length;//Numero de semestres cursados por el estudiante
				for (var i = 0; i < NSemestres; i++) {
					var Cursos=new Array();
					var Notas=new Array();
					var curso;
					var nota;
					var pga=new Array();
					var PGA=0;
					var stateSemester=data[Semestre].courseTaken[i].state;
					var Nasignaturas=data[Semestre].courseTaken[i].Courses.length;//NUMERO DE ASIGNATURAS EN EL PERIODO SELECCIONADO
					if (stateSemester=="cursed") {
						for (var j = 0; j < Nasignaturas; j++) {
		            		var notaAprob=data[Semestre].courseTaken[i].Courses[j].gradeAprobation;
		            		curso=data[Semestre].courseTaken[i].Courses[j].nombre;
		               		Cursos.push(curso);
		               		nota=data[Semestre].courseTaken[i].Courses[j].grade;
		               		Notas.push(nota);
		               		var statusCourse=data[Semestre].courseTaken[i].Courses[j].status;
		               		var semestre=data[Semestre].courseTaken[i].semester+" "+data[Semestre].courseTaken[i].year;
		                	PGA=PGA+(nota/Nasignaturas);
		                	//PARA ASIGNAR LAS NOTAS DEL SEMESTRE SELECCIONADO
		               		if(semestre==textBoton){
			               		for (var k = 1; k<=69; k++) {
									if(pestudios[k-1]==Cursos[j]){
										$("#"+k).css({"opacity":""});
										if(statusCourse=="passed"){
											if ((Notas[j]>=notaAprob) || (Notas[j]==0)){
												$("#"+k).text("");
												$("#"+k).removeClass("course");
												$("#"+k).addClass("cursoSeleccionado");
												if(Notas[j]!=0){$("#"+k).append($("<input/>",{class:"btnAprob",value:Notas[j].toFixed(1),disabled:"disabled"})).append(Cursos[j]+" ");}
												else{$("#"+k).append($("<input/>",{class:"btnAprob",value:Notas[j],disabled:"disabled"})).append(pestudios[k-1]);}
											}
											else{
												$("#"+k).removeClass("course");
												$("#"+k).text("");
												$("#"+k).addClass("cursoSeleccionado");
												$("#"+k).append($("<input/>",{class:"btnReprob",value:Notas[j].toFixed(1),disabled:"disabled"})).append(Cursos[j]+" ");
											}
										}
										else{
											$("#"+k).removeClass("course");
											$("#"+k).addClass("cursoSeleccionado");
					                		if (statusCourse=="anuled-student") {$("#"+k).append($("<input/>",{class:"btnAnula",value:"Anul-A",disabled:"disabled",title:"anulado por alumno"}));}
											else{$("#"+k).append($("<input/>",{class:"btnAnula",value:"Anul-E",disabled:"disabled",title:"anulado por escuela"}));}
										}
									}
								}
							}

							//PARA ASIGNAR LAS NOTAS DE LAS DEMÁS ASIGNATURAS EN OTROS SEMESTRES
							else{
								for (var k=1; k<=69; k++) {
									if((pestudios[k-1]==Cursos[j]) && (($("#"+k).hasClass("cursoSeleccionado")==false))){//cuando hay cursos tomados más de 1 vez
										if (statusCourse=="passed") {	
											if ((Notas[j]>=notaAprob) || (Notas[j]==0)){
												$("#"+k).empty();
												if(Notas[j]!=0){$("#"+k).append($("<input/>",{class:"btnAprob",value:Notas[j].toFixed(1),disabled:"disabled"})).append(pestudios[k-1]+" ");}
												else{$("#"+k).append($("<input/>",{class:"btnAprob",value:Notas[j],disabled:"disabled"})).append(pestudios[k-1]);}
											}
											else{
												repeticiones[k]=repeticiones[k]+1;
												$("#"+k).empty();
												if(repeticiones[k]==1){$("#"+k).append($("<input/>",{class:"btnReprob",value:Notas[j].toFixed(1),disabled:"disabled"})).append(pestudios[k-1]+" ");}
												else{$("#"+k).append($("<input/>",{class:"btnrepe",value:repeticiones[k],disabled:"disabled",title:"número repeticiones"})).append(pestudios[k-1]+" ");}
											}
										}
										else{
											if (statusCourse=="anuled-student") {$("#"+k).append($("<input/>",{class:"btnAnula",value:"Anul-A",disabled:"disabled",title:"anulado por alumno"}));}
											else{$("#"+k).append($("<input/>",{class:"btnAnula",value:"Anul-E",disabled:"disabled",title:"anulado por escuela"}));}
										}
									}
								}
							}
		            	}	
		            }
				}
			}
		});//fin de la funcion que se realiza cuando se presiona un boton
	}
	//ASIGNACION DE LOS NOMBRES DE LOS BOTONES
	$.getJSON("student.json",function(data,error){
		for (var CantSem in data) {
			var nCourses=data[CantSem].courseTaken.length;
			for (var i = 0; i < nCourses; i++) {
				var semestre=data[CantSem].courseTaken[i].semester;
				var año=data[CantSem].courseTaken[i].year;
    			var periodo=semestre+" "+año;
				$("#botones").append($("<input/>",{id:"btn"+b,class:"boton",type:"button",value:periodo}));//Adicion de botones por cada semestre
				$("#btn"+b).css({"color":"blue"});
				b++;
			}
		}
		$(".boton").click(function(){
			var idBoton=$(this).attr("id");
			var textBoton=$(this).val();
			if ($(this).hasClass("botonSelec")) {cargarDatos();
				d3.selectAll("circle").attr("fill",function(d,i){
					if (i>=pgp.length) {return "steelblue";}
					else{return "red";}
				});
			}
			else{
				botonclickeado(idBoton,textBoton);
			}
		});
	});

	function cargarPestudios(){//Asigna datos del plan de estudios solamente
    //ASIGNACIÓN DE NOMBRES AL ARREGLO pestudios Y DE LOS NOMBRES A LOS DIVS
	$.getJSON("ProgramStructure.json", function(data,error){
		for(var obj in data){
			var nTerms=data[obj].terms.length;
			for (var i = 0; i < nTerms; i++) {
				var nCourses=data[obj].terms[i].courses.length;
				var Area;
				for (var j = 0; j < nCourses; j++) {
					Area=data[obj].terms[i].courses[j].area;
					pestudios.push(data[obj].terms[i].courses[j].name);
				}
			}
		}
		for (var i = 1; i <=69; i++) {
			$("#"+i).addClass("course");
			$("#"+i).empty();
			$("#"+i).append(pestudios[i-1]);
		}
	});
	}//FIN DE LA FUNCION CARGA PLAN DE ESTUDIOS
	$("#años").append("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Primer Año&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Segundo Año");
	$("#años").append("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tercer Año&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Cuarto Año&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Quinto Año");
	cargarPestudios();
    cargarDatos();
    cargaGraficaPGA(pgp,pga);
    cargaSimbologiaAreas();
});