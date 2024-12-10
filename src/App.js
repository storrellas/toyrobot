import './App.css';
import { useEffect, useRef, useState } from 'react';
import robot from './assets/robot.png';

const DIRECTION = {
  NORTH: 'NORTH', WEST: 'WEST', SOUTH: 'SOUTH', EAST: 'EAST'
}

const useInterval = (callback, delay) => {
  const savedCallback = useRef();
 
  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
 
  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const useTimeout = (callback, delay) => {
  const savedCallback = useRef();
 
  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
 
  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setTimeout(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const BoardRow = (props) => {

  return  <div className="d-flex flex-grow-1">
            <div className="border text-center p-2" style={{ width: props.width, height: props.height}}>              
            </div>
            <div className="border text-center p-2" style={{ width: props.width, height: props.height}}>
            </div>
            <div className="border text-center p-2" style={{ width: props.width, height: props.height}}>
            </div>
            <div className="border text-center p-2" style={{ width: props.width, height: props.height}}>
            </div>
            <div className="border text-center p-2" style={{ width: props.width, height: props.height}}>
            </div>
          </div>
}

const BOARD_SIZE = 5;

const App = () => {
  const boardRef = useRef(null);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [ robotPosition, setRobotPosition ] = useState({ x: 0, y: 0, direction: DIRECTION.NORTH});
  const [ commandString, setCommandString ] = useState('')
  const [ commandList, setCommandList ] = useState([])
  const [ interval, setInterval ] = useState(null)
  const [ timeout, setTimeout ] = useState(null)
  const [ showReport, setShowReport ] = useState(false)
  const [ executingText, setExecutingText ] = useState(null)
  const [ errorText, setErrorText] = useState(false)

  useEffect( () => {
    const width = boardRef.current ? boardRef.current.clientWidth : 0
    const height = boardRef.current ? boardRef.current.clientHeight : 0

    if( width > height) {
      setHeight(height / BOARD_SIZE);
      setWidth(height / BOARD_SIZE);
    }else{
      setHeight(width / BOARD_SIZE);
      setWidth(width / BOARD_SIZE);
    }
  }, [])


  useInterval(() => {
    // Extract command    
    const command = commandList.shift().trim()
    const commandSplit = command.split(' ')
    const commandKey = commandSplit[0]
    setExecutingText(command)
    // PLACE
    if(commandKey === 'PLACE'){
      const position = commandSplit[1].split(',')
      const x = parseInt(position[0])
      const y = parseInt(position[1])
      const direction = position[2].trim()
      if( x < 0 || x > 4 || y < 0 || y > 4) {
        setErrorText(`ERROR ON COMMAND: '${command}'`)
        setInterval(null)
        setTimeout(1000)
        return
      }
      
      // Set robot position
      setRobotPosition({ x, y, direction})      
    }

    // MOVE
    if( commandKey === 'MOVE' ){
      if( robotPosition.direction === DIRECTION.NORTH && robotPosition.y < 4) {
        setRobotPosition({ ...robotPosition, y: robotPosition.y + 1 })
      }else if( robotPosition.direction === DIRECTION.SOUTH && robotPosition.y > 0) {
        setRobotPosition({ ...robotPosition, y: robotPosition.y - 1})
      }else if( robotPosition.direction === DIRECTION.WEST && robotPosition.x < 4) {
        setRobotPosition({ ...robotPosition, x: robotPosition.x - 1})
      }else if( robotPosition.direction === DIRECTION.EAST && robotPosition.x > 0) {
        setRobotPosition({ ...robotPosition, x: robotPosition.x + 1})
      }else{
        setErrorText(`ERROR ON COMMAND: '${command}'`)
        setInterval(null)
        setTimeout(1000)
        return
      }
    }

    // REPORT
    if( commandKey === 'REPORT') setShowReport(true)
    else setShowReport(false)

    // LEFT
    if( commandKey === 'LEFT'){
      let targetDirection = null;
      if( robotPosition.direction === DIRECTION.NORTH) targetDirection = DIRECTION.EAST
      if( robotPosition.direction === DIRECTION.EAST) targetDirection = DIRECTION.SOUTH
      if( robotPosition.direction === DIRECTION.SOUTH) targetDirection = DIRECTION.WEST
      if( robotPosition.direction === DIRECTION.WEST)  targetDirection = DIRECTION.NORTH

      // Set robot position
      setRobotPosition({ ...robotPosition, direction: targetDirection})      
    }    

    // RIGHT
    if( commandKey === 'RIGHT'){
      let targetDirection = null;
      if( robotPosition.direction === DIRECTION.NORTH) targetDirection = DIRECTION.WEST        
      if( robotPosition.direction === DIRECTION.WEST) targetDirection = DIRECTION.SOUTH
      if( robotPosition.direction === DIRECTION.SOUTH) targetDirection = DIRECTION.EAST
      if( robotPosition.direction === DIRECTION.EAST)  targetDirection = DIRECTION.NORTH

      // Set robot position
      setRobotPosition({ ...robotPosition, direction: targetDirection})   
    }


    if( commandList.length === 0){
      setInterval(null)
      setTimeout(1000)
    }
  }, interval)

  useTimeout( () => {
    setExecutingText(null)
  }, timeout)

  // -----------------------
  // HANDLERS
  // -----------------------

  const onExecute = async (e) => {
    const commandList = commandString.split('\n')
    const commandListProcessed = []
    // Ignore all commands before the first PLACE
    for( const command of commandList){
      if( commandListProcessed.length > 0 ) commandListProcessed.push(command)
      else{
        if( command.startsWith('PLACE') ) commandListProcessed.push(command)
      }
    }
    console.log("commandListProcessed", commandListProcessed)
    setCommandList(commandListProcessed)
    setInterval(1000)
    setErrorText(null)
  }

  const onFileChange = async (e) => {
    var file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (evt) {
          setCommandString(evt.target.result)
        }
        reader.onerror = function (evt) {
          setCommandString("ERRROR READING FILE")
        }
    }
  }


  console.log("ROBOT POSITION", robotPosition)
  // Compute class robot
  let classRobot = ""
  if (robotPosition.direction === DIRECTION.NORTH) classRobot = "robot-up"
  if (robotPosition.direction === DIRECTION.SOUTH) classRobot = "robot-down"
  if (robotPosition.direction === DIRECTION.WEST) classRobot = "robot-left"
  if (robotPosition.direction === DIRECTION.EAST) classRobot = "robot-right"

  // Compute top and left
  let top = 0;
  let left = 0;
  if( boardRef.current){
    top = height*((BOARD_SIZE-1)-robotPosition.y);
    left = width*(robotPosition.x) ;
  }

  return <main className="vh-100 vw-100 d-flex flex-column">
          <section className="text-center p-3 bg-dark text-light">
            <h1>Toy Robot</h1>
          </section>
          <section className="flex-grow-1 d-flex">
            
            <div className="w-50 p-3 d-flex flex-column" >
              <h2>Board</h2>
              <div className="flex-grow-1 position-relative" ref={boardRef}>
                <div className="robot-container position-absolute text-center" 
                  style={{ 
                    width: width, height: height, 
                    top: top, 
                    left: left,
                    background:'green'
                  }}>
                    <img className={classRobot} src={robot} alt="robot" style={{ height: '100%'}} /> 
                </div>
                <BoardRow height={height} width={width} row={0} robotPosition={robotPosition} />
                <BoardRow height={height} width={width} row={1} robotPosition={robotPosition} />
                <BoardRow height={height} width={width} row={2} robotPosition={robotPosition} />
                <BoardRow height={height} width={width} row={3} robotPosition={robotPosition} />
                <BoardRow height={height} width={width} row={4} robotPosition={robotPosition} />
              </div>
            </div>

            <div className="w-50 p-3">
              <div className='h-75  d-flex flex-column'>
                <h2>Commands</h2>
                <textarea className="form-control flex-grow-1" 
                  style={{ fontFamily: 'Consolas'}} value={commandString} 
                  onChange={(e) => setCommandString(e.target.value)}></textarea>
                <div className="mt-3">
                  <input className="form-control" type="file" onChange={e => onFileChange(e)} />
                </div>
                {executingText &&
                  <div className='mt-3'>
                    <input className='form-control' value={executingText} disabled></input>
                  </div>
                }
                <div className='text-end'>
                  <button className='btn btn-primary mt-3 w-50' onClick={(e) => onExecute(e)}>Execute</button>
                </div>
              </div>
              {showReport &&
              <div className='mt-3'>
                <div className='alert alert-success text-center'> 
                  <div><b>REPORT</b></div>
                  <div>X: {robotPosition.x} Y: {robotPosition.y} DIRECTION: {robotPosition.direction}</div>                                  
                </div>
              </div>
              }
              {errorText &&
              <div className='mt-3'>
                <div className='alert alert-danger text-center'> 
                  <div>{errorText}</div>
                </div>
              </div>
              }
            </div>


          </section>
          <footer className="p-3 bg-dark text-light text-end">
            Copyright 2024 - Sergi Torrellas
          </footer>

        </main>
}


export default App;
