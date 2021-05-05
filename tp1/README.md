# iasc-practica-ruby

## Objetivos

* Comparar comportamiento de Puma en sus múltiples modos
* Comparar modelo de procesos y threads

Durante esta práctica estaremos utilizando Ruby 2.7.1 y JRuby 9.2.8.0.

## Instalacion de entornos

A Continuacion de detallan los pasos para instalar Ruby y JRuby.

### Instalacion Ruby

Instalar [rvm](https://rvm.io).

```bash
gpg --keyserver hkp://pool.sks-keyservers.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB
\curl -sSL https://get.rvm.io | bash
echo "source $HOME/.rvm/scripts/rvm" >> ~/.bash_profile
```

Y luego, instalar Ruby y [bundler](http://bundler.io/):

```bash
rvm install 2.7.1
rvm use 2.7.1
gem install bundler
```

Instalar tambien jruby 9.2.8.0:

```bash
rvm get head
rvm install jruby-9.2.8.0
gem install bundler
```

### Instalacion de proyecto

Una vez que instalamos RVM, ejecutar las siguientes instrucciones:

```bash
bundle install
```

Esto instalará las dependencias y de aqui en más se puede proceder con la primera parte de la práctica.

Ante cualquier duda referirse a la documentacion de la [página](https://rvm.io/rvm/install)

## Consigna

### Generalidades

Esta práctica se realizará en varios escenarios. Para cada uno:

  * analizar el comportamiento de ambas rutas, anotarlo y comparar con las configuraciones anteriores.
  * analizar qué cantidad de threads del sistema operativo se crean (con `htop`)
  * probar tanto con un cliente como con varios clientes concurrentes

El objetivo no es obtener tiempos exactos (ya tendremos una práctica sobre ello) sino entender cualiativamente los modelos de SO Threads, Green Threads y Procesos.

#### Escenarios

1. Ejecutar utilizando Ruby con Puma, un proceso y un hilo
2. Ejecutar utilizando Ruby con Puma, N procesos (_clustered_) y un hilo
3. Ejecutar utilizando Ruby con Puma, 1 Proceso y N hilos
4. Ejecutar utilizando Ruby con Puma, N procesos (_clustered_) y N hilos
5. Ejecutar utilizando Jruby con Puma, 1 proceso y N hilos

### Preguntas para poder prepararse antes de la conclusión

#### Que buscamos como conclusión?

A partir de los escenarios, lo que nos gustaria que vean es:

Comparacion de las dos VMs que usan en la practica, MRI y Jruby, y como afecta al sistema:

- Como se comportaria el sistema de acuerdo a cada uno de los escenarios para las dos VMs
- Y para cada escenario, que diferencia hay entre los endpoints de io y cpu bound?

#### Preguntas que pueden hacerse antes de empezar a sacar conclusiones

A partir de las mediciones y comparaciones en cada escenario, deberías poder responder:

* Bajo green threads, si la cantidad de threads aumenta ¿mejora la performance de una tarea cpu bound?
* Bajo green threads, si la cantidad de threads aumenta ¿mejora la performance de una tarea IO bound?
* Bajo SO threads, si la cantidad de threads aumenta ¿mejora la performance de una tarea cpu bound?
* Bajo N procesos (modo clustered), si la cantidad de procesos aumenta por encima de la cantidad de cores de la máquina, ¿mejora la performance de una tarea cpu bound?
* Los Green threads de Ruby, ¿son realmente green threads? (Tip: analizar mediante `htop` si el sistema operativo los ve)

### FAQ

#### ¿Cómo lanzar el servidor?

Simplemente hay que ejecutar el comando `puma` mediante `bundle exec`:

```
bundle exec puma
```

#### ¿Cómo probar el servidor?

El servidor soporta dos rutas:  `/io_bound` y `/cpu_bound`. Como sus nombres lo indican, la primera realiza una tarea con mínimo procesamiento pero gran cantidad de E/S (lee un archivo), y la segunda es código puro (ejecuta una función fibonacci).

Para probarlas, se puede utilizar por ejemplo:

* `curl` (desde la terminal)
* [`Postman`](https://www.getpostman.com/) (desde el browser).

#### ¿Cómo controlar la cantidad de hilos y procesos

El comando `puma` acepta dos parámetros para controlarlos `-t` y `-w`:

* `-t` define la cantidad mínima y máxima de threads
* `-w` define la cantidad de procesos (llamados _workers_)

Por ejemplo:

```
# Lanzar puma con 4 hilos
bundle exec puma -t 4:4

# Lanzar puma con 1 proceso
bundle exec puma -w 1

# Lanzar puma con 2 procesos
# (lo que se conoce como modo clustered, es decir, que  la cantidad de workers > 1)
bundle exec puma -w 2
```

Estas opciones son combinables.

#### ¿Qué hago si la tarea cpu bound termina demasiado rápido/demasiado lento en mi máquina?

Ajustá el valor del fibonacci en `config.ru`

```
get '/cpu_bound' do
  # Ajustá el valor del 34 para lograr un calculo que se tome su tiempo pero termine
  {result: fib(34)}.to_json
end
```

#### ¿Cómo hago para correr este servidor con Ruby? ¿Y con JRuby?

Las instrucciones anteriores corren este servidor con Ruby estándar (MRI, también llamado YARV). Para ejecutarlo con JRuby, es necesario cambiar el intérprete a mano e instalar bundler :

```
rvm use jruby-9.2.8.0
gem install bundler
```

y luego ejecutar `puma` normalmente.


#### ¿Qué puedo hacer si quiero correr (por algún motivo) el servidor con otra versión de ruby?

Tenés que

* modificar el archivo `.ruby-version` y el `Gemfile`,
* luego `gem install bundler`
* luego `bundle install`

Y eso es todo.
