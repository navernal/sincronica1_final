import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private dbInstance: SQLiteObject | null = null;
  private isDbReady = false;
  private dbReadyPromise: Promise<void> | null = null;

  constructor(private platform: Platform, private sqlite: SQLite) {}

  async initializeDatabase() {
    if (this.dbReadyPromise) {
      return this.dbReadyPromise;
    }

    this.dbReadyPromise = new Promise(async (resolve, reject) => {
      try {
        await this.platform.ready();

        const db = await this.sqlite.create({
          name: 'my_database.db',
          location: 'default'
        });

        this.dbInstance = db;

      
        await db.executeSql(`
          CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            email TEXT NOT NULL,
            password TEXT NOT NULL,
            rut TEXT NOT NULL
          )
        `, []);

        await db.executeSql(`
          CREATE TABLE IF NOT EXISTS manicurista (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            direccion TEXT,
            telefono TEXT,
            instagram TEXT
          )
        `, []);

        await db.executeSql(`
        CREATE TABLE IF NOT EXISTS agenda (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            correo TEXT NOT NULL,
            fecha TEXT NOT NULL,
            hora TEXT NOT NULL,
            servicio TEXT NOT NULL,
            idManicurista INTEGER NOT NULL,
            idUsuario INTEGER NOT NULL,
            FOREIGN KEY (idManicurista) REFERENCES manicurista(id),
            FOREIGN KEY (idUsuario) REFERENCES usuarios(id)
        )
        `, []);


        await db.executeSql(`
        CREATE TABLE IF NOT EXISTS catalogo (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            idManicurista INTEGER NOT NULL,
            imagenUrl TEXT NOT NULL,
            fecha TEXT NOT NULL,
            FOREIGN KEY (idManicurista) REFERENCES manicurista(id)
        )
        `, []);

        await db.executeSql(`
            CREATE TABLE IF NOT EXISTS comentarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                idCatalogo INTEGER NOT NULL,
                nombreCliente TEXT NOT NULL,
                mensaje TEXT NOT NULL,
                fechaComentario TEXT NOT NULL,
                FOREIGN KEY (idCatalogo) REFERENCES catalogo(id)
            )
            `, []);



        this.isDbReady = true;
        console.log('Base de datos y tablas listas');
        resolve();

      } catch (error) {
        console.error('Error al crear la base de datos:', error);
        reject(error);
      }
    });

    return this.dbReadyPromise;
  }

  private async ensureDbReady() {
    if (!this.isDbReady) {
      await this.initializeDatabase();
    }
  }


  async validarUsuario(email: string, password: string): Promise<any | null> {
  if (!this.dbInstance) return null;

  const sql = `SELECT * FROM usuarios WHERE email = ? AND password = ? LIMIT 1`;
  const result = await this.dbInstance.executeSql(sql, [email, password]);

  if (result.rows.length > 0) {
    return result.rows.item(0);  
  } else {
    return null;  
  }
}

async obtenerUsuarioPorId(id: number): Promise<any> {
  await this.ensureDbReady();
  if (!this.dbInstance) return null;

  try {
    const res = await this.dbInstance.executeSql(`SELECT id, nombre, email, rut FROM usuarios WHERE id = ?`, [id]);

    if (res.rows.length > 0) {
      return res.rows.item(0); // Retorna el primer (y único) resultado
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return null;
  }
}


async agregarUsuario(nombre: string, email: string, password: string, rut: string): Promise<number | null> {
  await this.ensureDbReady();
  if (!this.dbInstance) return null;

  const sql = `INSERT INTO usuarios (nombre, email, password, rut) VALUES (?, ?, ?, ?)`;
  const data = [nombre, email, password, rut];

  try {
    const res = await this.dbInstance.executeSql(sql, data);
    const insertId = res.insertId;
    console.log('Usuario insertado con ID:', insertId);
    return insertId;
  } catch (error) {
    console.error('Error insertando usuario:', error);
    return null;
  }
}


  async obtenerUsuarios(): Promise<any[]> {
    await this.ensureDbReady();

    if (!this.dbInstance) return [];

    const result = await this.dbInstance.executeSql('SELECT * FROM usuarios', []);
    const usuarios: any[] = [];

    for (let i = 0; i < result.rows.length; i++) {
      usuarios.push(result.rows.item(i));
    }

    return usuarios;
  }

  async eliminarUsuario(id: number) {
    await this.ensureDbReady();

    if (!this.dbInstance) return;

    try {
      await this.dbInstance.executeSql('DELETE FROM usuarios WHERE id = ?', [id]);
      console.log(`Usuario con id ${id} eliminado`);
    } catch (error) {
      console.error('Error eliminando usuario:', error);
    }
  }

  async actualizarUsuario(id: number, nombre: string, email: string, password: string, rut: string) {
    await this.ensureDbReady();

    if (!this.dbInstance) return;

    const sql = `UPDATE usuarios SET nombre = ?, email = ?, password = ?, rut = ? WHERE id = ?`;
    const data = [nombre, email, password, rut, id];

    try {
      await this.dbInstance.executeSql(sql, data);
      console.log(`Usuario con id ${id} actualizado`);
    } catch (error) {
      console.error('Error actualizando usuario:', error);
    }
  }

  async agregarManicurista(nombre: string, direccion: string, telefono: string, instagram: string) {
    await this.ensureDbReady();

    if (!this.dbInstance) return;

    const sql = `INSERT INTO manicurista (nombre, direccion, telefono, instagram) VALUES (?, ?, ?, ?)`;
    const data = [nombre, direccion, telefono, instagram];

    try {
      await this.dbInstance.executeSql(sql, data);
      console.log('Manicurista insertado');
    } catch (error) {
      console.error('Error insertando manicurista:', error);
    }
  }

  async obtenerManicuristas(): Promise<any[]> {
    await this.ensureDbReady();

    if (!this.dbInstance) return [];

    const result = await this.dbInstance.executeSql('SELECT * FROM manicurista', []);
    const lista: any[] = [];

    for (let i = 0; i < result.rows.length; i++) {
      lista.push(result.rows.item(i));
    }

    return lista;
  }

  async eliminarManicurista(id: number) {
    await this.ensureDbReady();

    if (!this.dbInstance) return;

    try {
      await this.dbInstance.executeSql('DELETE FROM manicurista WHERE id = ?', [id]);
      console.log(`Manicurista con id ${id} eliminado`);
    } catch (error) {
      console.error('Error eliminando manicurista:', error);
    }
  }

  async actualizarManicurista(id: number, nombre: string, direccion: string, telefono: string, instagram: string) {
    await this.ensureDbReady();

    if (!this.dbInstance) return;

    const sql = `UPDATE manicurista SET nombre = ?, direccion = ?, telefono = ?, instagram = ? WHERE id = ?`;
    const data = [nombre, direccion, telefono, instagram, id];

    try {
      await this.dbInstance.executeSql(sql, data);
      console.log(`Manicurista con id ${id} actualizado`);
    } catch (error) {
      console.error('Error actualizando manicurista:', error);
    }
  }

async agendarCita(
  nombre: string,
  correo: string,
  fecha: string,
  hora: string,
  servicio: string,
  idManicurista: number,
  idUsuario: number
) {
  if (!this.dbInstance) return;

  const sql = `
    INSERT INTO agenda (nombre, correo, fecha, hora, servicio, idManicurista, idUsuario)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const data = [nombre, correo, fecha, hora, servicio, idManicurista, idUsuario];

  await this.dbInstance.executeSql(sql, data);
}


  async obtenerCitas(): Promise<any[]> {
    await this.ensureDbReady();

    if (!this.dbInstance) return [];

    const result = await this.dbInstance.executeSql(`
      SELECT a.*, m.nombre as manicuristaNombre 
      FROM agenda a
      JOIN manicurista m ON a.idManicurista = m.id
    `, []);

    const citas: any[] = [];

    for (let i = 0; i < result.rows.length; i++) {
      citas.push(result.rows.item(i));
    }

    return citas;
  }

  async eliminarCita(id: number) {
    await this.ensureDbReady();

    if (!this.dbInstance) return;

    try {
      await this.dbInstance.executeSql('DELETE FROM agenda WHERE id = ?', [id]);
      console.log(`Cita con id ${id} eliminada`);
    } catch (error) {
      console.error('Error eliminando cita:', error);
    }
  }

  async actualizarCita(id: number, nombre: string, correo: string, fecha: string, hora: string, servicio: string, idManicurista: number) {
    await this.ensureDbReady();

    if (!this.dbInstance) return;

    const sql = `
      UPDATE agenda 
      SET nombre = ?, correo = ?, fecha = ?, hora = ?, servicio = ?, idManicurista = ?
      WHERE id = ?
    `;
    const data = [nombre, correo, fecha, hora, servicio, idManicurista, id];

    try {
      await this.dbInstance.executeSql(sql, data);
      console.log(`Cita con id ${id} actualizada`);
    } catch (error) {
      console.error('Error actualizando cita:', error);
    }
  }


  async agregarTrabajoCatalogo(idManicurista: number, imagenUrl: string, fecha: string) {
  if (!this.dbInstance) return;

  const sql = `INSERT INTO catalogo (idManicurista, imagenUrl, fecha) VALUES (?, ?, ?)`;
  const data = [idManicurista, imagenUrl, fecha];

  await this.dbInstance.executeSql(sql, data);
}


async agregarComentario(idCatalogo: number, nombreCliente: string, mensaje: string, fechaComentario: string) {
  if (!this.dbInstance) return;

  const sql = `INSERT INTO comentarios (idCatalogo, nombreCliente, mensaje, fechaComentario) VALUES (?, ?, ?, ?)`;
  const data = [idCatalogo, nombreCliente, mensaje, fechaComentario];

  await this.dbInstance.executeSql(sql, data);
}

async obtenerComentariosPorCatalogo(idCatalogo: number): Promise<any[]> {
  if (!this.dbInstance) return [];

  const sql = `SELECT * FROM comentarios WHERE idCatalogo = ? ORDER BY fechaComentario DESC`;
  const result = await this.dbInstance.executeSql(sql, [idCatalogo]);

  const comentarios: any[] = [];
  for (let i = 0; i < result.rows.length; i++) {
    comentarios.push(result.rows.item(i));
  }
  return comentarios;
}

async obtenerCatalogoPorManicurista(idManicurista: number): Promise<any[]> {
  if (!this.dbInstance) return [];

  const sql = `SELECT * FROM catalogo WHERE idManicurista = ? ORDER BY fecha DESC`;
  const result = await this.dbInstance.executeSql(sql, [idManicurista]);

  const lista: any[] = [];
  for (let i = 0; i < result.rows.length; i++) {
    const item = result.rows.item(i);
    const comentarios = await this.obtenerComentariosPorCatalogo(item.id);
    lista.push({ 
      id: item.id, 
      imagenUrl: item.imagenUrl, 
      fecha: item.fecha, 
      comentarios: comentarios
    });
  }
  return lista;
}

async obtenerCitasPorUsuario(idUsuario: number): Promise<any[]> {
  await this.ensureDbReady();
  if (!this.dbInstance) return [];

  try {
    const res = await this.dbInstance.executeSql(
      `SELECT a.id, a.fecha, a.hora, a.servicio, m.nombre AS manicurista
       FROM agenda a
       JOIN manicurista m ON a.idManicurista = m.id
       WHERE a.idUsuario = ? ORDER BY a.fecha DESC, a.hora ASC`,
      [idUsuario]
    );

    const citas: any[] = [];
    for (let i = 0; i < res.rows.length; i++) {
      citas.push(res.rows.item(i));
    }
    return citas;
  } catch (error) {
    console.error('Error obteniendo citas del usuario:', error);
    return [];
  }
}



}
