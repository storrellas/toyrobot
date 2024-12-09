import logo from './logo.svg';
import './App.css';
import { useEffect, useRef, useState } from 'react';
import robot from './assets/robot.png';

const DIRECTION = {
  UP: 'UP', RIGHT: 'RIGHT', DOWN: 'DOWN', LEFT: 'LEFT'
}


const BoardRow = (props) => {

  return  <div className="d-flex flex-grow-1 justify-content-around">
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


const App = () => {
  const boardRef = useRef(null);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [ robotPosition, setRobotPosition ] = useState({ x: 2, y: 0, direction: DIRECTION.LEFT});
  
  useEffect( () => {
    const width = boardRef.current ? boardRef.current.clientWidth : 0
    const height = boardRef.current ? boardRef.current.clientHeight : 0

    if( width > height) {
      setHeight(height / 5);
      setWidth(height / 5);
    }else{
      setHeight(width / 5);
      setWidth(width / 5);
    }
  }, [])

  // Compute class robot
  let classRobot = ""
  if (robotPosition.direction === DIRECTION.UP) classRobot = "robot-up"
  if (robotPosition.direction === DIRECTION.DOWN) classRobot = "robot-down"
  if (robotPosition.direction === DIRECTION.LEFT) classRobot = "robot-left"
  if (robotPosition.direction === DIRECTION.RIGHT) classRobot = "robot-right"

  return <main className="vh-100 vw-100 d-flex flex-column">
          <section className="text-center p-3 bg-dark text-light">
            <h1>Toy Robot</h1>
          </section>
          <section className="flex-grow-1 d-flex">
            
            <div className="w-50 p-3 d-flex flex-column" >
              <h2>Board</h2>
              <div className="flex-grow-1 position-relative" ref={boardRef}>
                <div className="position-absolute text-center p-2" 
                  style={{ width: width, height: height, top: height*robotPosition.y, left: width*robotPosition.x }}>
                  <img className={classRobot} src={robot} alt="robot" style={{ height: '100%'}} /> 
                </div>
                <BoardRow height={height} width={width} row={0} robotPosition={robotPosition} />
                <BoardRow height={height} width={width} row={1} robotPosition={robotPosition}  />
                <BoardRow height={height} width={width} row={2} robotPosition={robotPosition}  />
                <BoardRow height={height} width={width} row={3} robotPosition={robotPosition}  />
                <BoardRow height={height} width={width} row={4} robotPosition={robotPosition}  />
              </div>



            </div>

            <div className="w-50 p-3">
              <div className='h-50  d-flex flex-column'>
                <h2>Commands</h2>
                <textarea class="form-control flex-grow-1"></textarea>
              
                <div className='text-end'>
                  <button className='btn btn-primary mt-3 w-50'>Execute</button>
                </div>
              </div>
            </div>


          </section>
          <footer className="p-3 bg-dark text-light text-end">
            Copyright 2024 - Sergi Torrellas
          </footer>

        </main>
}

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

export default App;
