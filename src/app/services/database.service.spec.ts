import { TestBed } from '@angular/core/testing';
import { DatabaseService } from './database.service';
import { Platform } from '@ionic/angular';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

describe('DatabaseService', () => {
  let service: DatabaseService;
  let sqliteMock: any;
  let platformMock: any;

  beforeEach(() => {
    sqliteMock = {
      create: jasmine.createSpy('create').and.returnValue(Promise.resolve({
        executeSql: jasmine.createSpy('executeSql').and.returnValue(Promise.resolve({ rows: { length: 0, item: () => null } }))
      }))
    };

    platformMock = {
      ready: jasmine.createSpy('ready').and.returnValue(Promise.resolve())
    };

    TestBed.configureTestingModule({
      providers: [
        DatabaseService,
        { provide: SQLite, useValue: sqliteMock },
        { provide: Platform, useValue: platformMock }
      ]
    });

    service = TestBed.inject(DatabaseService);
  });

it('debe inicializar la base de datos correctamente', async () => {
  await service.initializeDatabase();
  expect(sqliteMock.create).toHaveBeenCalled();
});


it('debe agregar un usuario correctamente', async () => {
  (service as any).dbInstance = {
    executeSql: jasmine.createSpy('executeSql').and.returnValue(Promise.resolve({ insertId: 1 }))
  };

  spyOn(service as any, 'ensureDbReady').and.returnValue(Promise.resolve());

  const id = await service.agregarUsuario('Natalia', 'natalia@test.com', '1234', '12345678-9');
  expect(id).toBe(1);
});




it('debe validar un usuario si existe', async () => {
  (service as any).dbInstance = {
    executeSql: jasmine.createSpy('executeSql').and.returnValue(Promise.resolve({
      rows: {
        length: 1,
        item: () => ({ id: 1, email: 'natalia@test.com' })
      }
    }))
  };

  const usuario = await service.validarUsuario('natalia@test.com', '1234');
  expect(usuario.email).toBe('natalia@test.com');
});



it('debe retornar lista de usuarios', async () => {
  (service as any).dbInstance = {
    executeSql: jasmine.createSpy('executeSql').and.returnValue(Promise.resolve({
      rows: {
        length: 2,
        item: (i: number) => i === 0
          ? { id: 1, nombre: 'Nati' }
          : { id: 2, nombre: 'Jose' }
      }
    }))
  };

  spyOn(service as any, 'ensureDbReady').and.returnValue(Promise.resolve());

  const usuarios = await service.obtenerUsuarios();
  expect(usuarios.length).toBe(2);
});



it('debe eliminar usuario sin errores', async () => {
  (service as any).dbInstance = {
    executeSql: jasmine.createSpy('executeSql').and.returnValue(Promise.resolve())
  };

  await service.eliminarUsuario(1);
  expect((service as any).dbInstance.executeSql).toHaveBeenCalledWith('DELETE FROM usuarios WHERE id = ?', [1]);
});



it('debe actualizar un usuario correctamente', async () => {
  (service as any).dbInstance = {
    executeSql: jasmine.createSpy('executeSql').and.returnValue(Promise.resolve())
  };

  await service.actualizarUsuario(1, 'NuevoNombre', 'nuevo@email.com', 'pass', '11111111-1');
  expect((service as any).dbInstance.executeSql).toHaveBeenCalled();
});



});
