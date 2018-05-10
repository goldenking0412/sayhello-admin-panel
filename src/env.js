import Production from './enviroments/production'
import Development from './enviroments/development'

export default process.env.NODE_ENV == 'development' ?  Development : Production