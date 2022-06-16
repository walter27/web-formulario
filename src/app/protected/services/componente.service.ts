import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Componente, ResultadoVariable, Variante, Asignacion, Usuario, Variable, ResultadoVariante, Recomendacion } from '../../auth/iterfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ComponenteService {

  private baseUrl: string = environment.baseUrl;
  selectedFiles: File[] = [];
  idUsuario!: number;
  mostrarCarousel: boolean = false;

  constructor(private http: HttpClient) { }

  listarComponente() {
    const url = `${this.baseUrl}/componente/listar`;
    return this.http.get<Componente[]>(url).pipe(catchError(this.errorHandler));
  }

  listarVariable() {
    const url = `${this.baseUrl}/variable/listar`;
    return this.http.get<Variable[]>(url).pipe(catchError(this.errorHandler));
  }

  registrarRespuestasVerdaderas(listaAsignacion: Asignacion[], archivos: File[]) {
    const url = `${this.baseUrl}/variante/registrar/verdaderas`;
    const formData = new FormData();
    for (const archivo of archivos) {
      formData.append('archivos', archivo, archivo.name);
    }
    formData.append('listaAsignacion', new Blob([JSON.stringify(listaAsignacion)], { type: 'application/json' }))
    return this.http.post<any>(url, formData).pipe(catchError(this.errorHandler));
  }

  registrarRespuestasFalsas(listaAsignacion: Asignacion[]) {
    const url = `${this.baseUrl}/variante/registrar/falsas`;
    const formData = new FormData();
    formData.append('listaAsignacion', new Blob([JSON.stringify(listaAsignacion)], { type: 'application/json' }))
    return this.http.post<any>(url, formData).pipe(catchError(this.errorHandler));
  }
  listarAsignaciones() {
    const url = `${this.baseUrl}/asignacion/listar/${this.idUsuario}`;
    return this.http.get<Asignacion[]>(url).pipe(catchError(this.errorHandler));
  }
  registrarAsignaciones(listaAsignacion: Asignacion[]) {

    const formData = new FormData();
    formData.append('listaAsignacion', new Blob([JSON.stringify(listaAsignacion)], { type: 'application/json' }))
    const url = `${this.baseUrl}/variante/registrar/asignaciones`;
    return this.http.post<any>(url, formData).pipe(catchError(this.errorHandler));
  }

  listarUsuario() {
    const url = `${this.baseUrl}/usuario/listar`;
    return this.http.get<Usuario[]>(url).pipe(catchError(this.errorHandler));
  }

  buscarUsuario(idUsuario: number) {
    const url = `${this.baseUrl}/usuario/buscar/${idUsuario}`;
    return this.http.get<Usuario>(url).pipe(catchError(this.errorHandler));
  }

  calcularNormalizacionVariante() {
    const url = `${this.baseUrl}/variante/calcular/normalizacion/${this.idUsuario}`;
    return this.http.post<any>(url, {}).pipe(catchError(this.errorHandler));
  }

  calcularNormalizacionVariable() {
    const url = `${this.baseUrl}/variable/calcular/normalizacion/${this.idUsuario}`;
    return this.http.post<any>(url, {}).pipe(catchError(this.errorHandler));
  }

  listarNormalizacionVariante() {
    const url = `${this.baseUrl}/variante/buscar/normalizacion/${this.idUsuario}`;
    return this.http.get<ResultadoVariante[]>(url).pipe(catchError(this.errorHandler));
  }

  listarNormalizacionVariable() {
    const url = `${this.baseUrl}/variable/buscar/normalizacion/${this.idUsuario}`;
    return this.http.get<ResultadoVariable[]>(url).pipe(catchError(this.errorHandler));
  }

  listarVariante() {
    const url = `${this.baseUrl}/variante/listar`;
    return this.http.get<Variante[]>(url).pipe(catchError(this.errorHandler));
  }

  listarRecomendaciones() {
    const url = `${this.baseUrl}/assets/data/data.json`;
    return this.http.get<Recomendacion[]>(url).pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(() => error);
  }

}


