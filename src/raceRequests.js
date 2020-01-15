import React, {useState, useReducer, useEffect} from 'react'

function dummyRequest(response, delay = 1000) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(response)
		}, delay)
	})
}

const data = {
	front: ['a','b','c'],
	back: [1,2,3]
}

let counter = 0;

async function getData(kind) {
	const count = counter + 1;
	++counter;
	console.log(`Request:${count}<${kind}> ...`)
	let r = await dummyRequest(data[kind], kind === 'front' ? 3501 : 1500);
	console.log(`Request:${count}<${kind}> done`)
	return r;
}

export default function RaceRequests() {
	const [state, dispatch] = useReducer(reducer, {data: []})
	const [cumData, setCumData] = useState([])

	function reducer(state, action) {
		//console.log(`Action: ${action.type}`);
		switch(action.type) {
			case 'front': {
				return {...state, data: [...action.payload, ...state.data]}
			}
			case 'back': {
				return {...state, data: [...state.data, ...action.payload]}
			}
			default: {
				console.log(`Invalid action type ${action.type}`);
			}
		}
	}

	useEffect(() => {
		function getBack() {
		}


		function requestAllData() {
			getData('front').then(data => dispatch({type: 'front', payload: data}));
			getData('back').then(data => dispatch({type: 'back', payload: data}))
				.then(() => getData('back').then(data => dispatch({type: 'back', payload: data})))
				.then(() => getData('back').then(data => dispatch({type: 'back', payload: data})))
		}

		requestAllData();
	}, [])

	useEffect(() => {
		setCumData(cumData => cumData.length > 0 ? 
			[...cumData, state.data] : 
			[state.data]
		)
		console.log(state.data);
	}, [state])

	useEffect(() => {
		console.log(cumData);
	}, [cumData])

	return (
		<>
			<h3>Current data</h3>
			<div id='data'>{state.data}</div>
			<br/>
			<h3>Data version history</h3>
			<div id='cumData' align='left'>
				{ cumData.map((d,i) => (<li key={i}>{d}</li>)) }
			</div>
		</>
	)
}


