import {useState} from 'react';
import update from 'immutability-helper';
import * as tf from '@tensorflow/tfjs';

const MainPage = () => {
    const [pairs, setPairs] = useState([
        { x: -1, y: -3},
        {x: 0, y:0}, 
        {x: 1, y: 1},
        {x: 2, y: 4},
        {x: 4, y: 16},
        {x: 5, y: 25}
    ]);

    const [modelState, setModelState] = useState({
        model: null,
        traind: false,
        predictedValue: 'click to train',
        valuseToPredict: 1
    });

    // event handeler 
    const handelValuePairChange = (e) =>{
        const updateValuePairs = update(pairs, {
            [e.target.dataset.index]: {
                [e.target.name]: {$set: parseInt(e.target.value)}
            }
        })

        setPairs(
            updateValuePairs
        )
    };

    const handelAddItem = () => {
        setPairs([
            ...pairs,
            {x:1, y:1}
        ])
    };


    const handleModleChange = (e) => setModelState({
        ...modelState,
        [e.target.name]: [parseInt(e.target.value)],
    });

    const handleTrainModel = () =>{
        let xValues = [],
        yValues = [];

        pairs.forEach((val, index) => {
            xValues.push(val.x);
            yValues.push(val.y);
        });

        // Define a model for linear regression.
    const model = tf.sequential();
   // add hidden layers 
   model.add(tf.layers.dense({ units: 128, activation: 'relu', inputShape: [1] }));

   // Add another hidden layer with 64 units and ReLU activation
   model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
   
   // Add the output layer with 1 unit
   model.add(tf.layers.dense({ units: 1 }));
   
   // Compile the model
   model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });




    const xs = tf.tensor2d(xValues, [xValues.length, 1]);
    const ys = tf.tensor2d(yValues, [yValues.length, 1]);

    // Train the model using the data.
    model.fit(xs, ys, { epochs: 450 }).then(() => {
        setModelState({
            ...modelState,
            model: model,
            trained: true,
            predictedValue: 'Ready for making predictions',
        });
    });
    }

    const handlePredict = () =>{
        // Use the model to do inference on a data point the model hasn't seen before:
        const predictedValue = modelState.model.predict(tf.tensor2d([modelState.valueToPredict], [1, 1])).arraySync()[0][0];

        setModelState({
            ...modelState,
            predictedValue: predictedValue,
        });
    }


    return ( 
    <div>
        <h1> Training on X, Y data</h1>

        <div>X</div>
        <div>Y</div>

        {pairs.map((val, index) => {
        return (
            <div key={index} >
                <input
                    
                    value={val.x}
                    name="x"
                    data-index={index}
                    onChange={handelValuePairChange}
                    type="number" pattern="[0-9.]*" />
                <input
                    
                    value={val.y}
                    name="y"
                    data-index={index}
                    onChange={handelValuePairChange}
                    type="number" />
                    
            </div>
            
        );
    })}

    <button
        onClick={handelAddItem}>
        +
    </button>

    <button
        onClick={handleTrainModel}>
        Train
    </button>


    <div >
    <h2>Predicting</h2>
    <input
        
        value={modelState.valueToPredict}
        name="valueToPredict"
        onChange={handleModleChange}
        type="number"
        placeholder="Enter an integer number" /><br />
    <div className="element">
        {modelState.predictedValue}
    </div>
    <button

        onClick={handlePredict}
        disabled={!modelState.trained}>
        Predict
    </button>
</div>
    </div> );
}
 
export default MainPage;