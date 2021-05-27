import React, { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import RestEmulator from './rest-emulator';
import Button from 'react-bootstrap/Button';
import { ButtonGroup } from 'react-bootstrap';
import globalState from './store';
import { useDispatch, useSelector } from 'react-redux';

function Header() {
  const element = (<div className="header">
    React <b>CRUD</b>
  </div>);
  return element;
}

const LastAction = (props) => {
  const dispatch = useDispatch();
  const lastAction = useSelector(state => state.lastAction);
  let element = <div></div>;
  if (lastAction === 'CREATE') {
    element = <Alert
      onClose={ () => {dispatch({type:'SET_LAST_ACTION', lastAction: ''}) }}
      dismissible variant="success">Успешно добавлено</Alert>;
  }
  if (lastAction === 'DELETE') {
    element = <Alert
    onClose={ () => {dispatch({type:'SET_LAST_ACTION', lastAction: ''}) }}
    dismissible
    variant="danger">Успешно удалено</Alert>;
  }
  if (lastAction === 'UPDATE') {
    element = <Alert
    onClose={ () => {dispatch({type:'SET_LAST_ACTION', lastAction: ''}) }}
    dismissible
    variant="info">Успешно обновлено</Alert>;
  }
  return element;
}


const Search = (props) => {
  const [search, setSearch] = useState('');

  const element =
      <Row className="custom-search">
        <Col>
              <Form.Control
                value={search}
                onChange={(event) => {
                    const newValue = event.target.value;
                    setSearch(newValue);
                    props.emitSearch(newValue);
                  }
                }
                type="text" placeholder="Поиск по имени..." />
        </Col>
      </Row>;
  return element;
}

const InputField = (props) => {
  const disabled = props.disabled ?? false;

  return <div>
    { props.label }
    <Form.Control
      disabled={disabled}
      className="input"
      value={props.value}
      onChange={(event) => {props.changeHandler(event)}}
      type="text" placeholder={props.placeholder} />
  </div>;
};

const Entry = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  
  const updateEntry = (id, object) => {
    setIsLoading(true);
    RestEmulator.editPerson(id, object).finally(() => {
      dispatch({ type: 'SET_LAST_ACTION', lastAction: 'UPDATE' });
      setIsLoading(false);
    });
  };

  const deleteEntry = (id) => {
    setIsLoading(true);
    RestEmulator.removePerson(id).then(() => {
      dispatch({ type: 'SET_LAST_ACTION', lastAction: 'DELETE' });
      props.updateREST();
    });
  };

  const handleInputChange = (event, link) => {
    const newValue = event.target.value;
    props.setField(props.entryInfo.id, link, newValue);
  };

  return <div className="border entry rounded">
      <InputField
        value={props.entryInfo.name}
        placeholder="Имя..."
        label="Имя"
        changeHandler={(event) => { handleInputChange(event, 'name') }}/>
      <InputField
        value={props.entryInfo.age}
        placeholder="Возраст..."
        label="Возраст"
        changeHandler={(event) => { handleInputChange(event, 'age') }}/>
      <InputField
        value={props.entryInfo.job}
        placeholder="Профессия..."
        label="Профессия"
        changeHandler={(event) => { handleInputChange(event, 'job') }}/>
      
      <div className="buttons">
        <ButtonGroup className="in-center">
            <Button
              style={{'width': '150px'}}
              onClick={() => {updateEntry(props.entryInfo.id, {
                age: props.entryInfo.age,
                job: props.entryInfo.job,
                name: props.entryInfo.name,
              })}}
              disabled={isLoading}>
                Обновить в API
            </Button>
            <Button
            onClick={() => { deleteEntry(props.entryInfo.id) }}
            disabled={isLoading} variant="danger">Удалить</Button>
        </ButtonGroup>
      </div>
  </div>;
}

function AddEntryBlock(props) {
  const [inputs, setInputs] = useState({
    name: '',
    age: '',
    job: '',
  });
  const dispatch = useDispatch();

  const [isAdding, setIsAdding] = useState(false)

  const handleChangeInput = (event, name) => {
    const newValue = event.target.value;
    setInputs( {...inputs, [name]: newValue} );
  };

  const handleAdd = () => {
    setIsAdding(true);
    RestEmulator.addPerson(inputs.name, inputs.age, inputs.job).then(() => {
      props.updateREST().then(() => {
        dispatch({ type: 'SET_LAST_ACTION', lastAction: 'CREATE' });
        setIsAdding(false);
        setInputs({ name: '', age: '', job: '' });
      });
    });
  };

  const disableInputs = globalState.getState().loading;
  return <div className="entry border rounded">
      <InputField
        disabled={disableInputs}
        value={inputs.name}
        placeholder="Имя..."
        label="Имя"
        changeHandler={(event) => { handleChangeInput(event, 'name') }}/>
      <InputField
        disabled={disableInputs}
        value={inputs.age}
        placeholder="Возраст..."
        label="Возраст"
        changeHandler={(event) => { handleChangeInput(event, 'age') }}/>
      <InputField
        disabled={disableInputs}
        value={inputs.job}
        placeholder="Профессия..."
        label="Профессия"
        changeHandler={(event) => { handleChangeInput(event, 'job') }}/>
      <div className="buttons">
        <Button className="in-center" variant="success"
          disabled={isAdding}
          onClick={() => {handleAdd()}}>
          Добавить
        </Button>
      </div>
  </div>
}

function Entries(props) {
  const [entries, setEntries] = useState([]);
  const dispatch = useDispatch();

  const getEntriesFromREST = () => {
    dispatch({ type: 'SET_NOT_LOADED' });
    return RestEmulator.getEntries().then((entriesList) => {
      console.log('entries list', entriesList.slice());
      dispatch({ type: 'SET_LOADED' });
      setEntries(entriesList);
    });
  };

  useEffect(() => {
    getEntriesFromREST();
  }, [false]);

  const handleSetField = (id, link, newValue) => {
    const newEntries = entries.slice();
    for (let i = 0; i < newEntries.length; i += 1) {
      const entry = newEntries[i];
      if (entry.id === id) {
        newEntries[i][link] = newValue;
      }
    }
    setEntries(newEntries);
  };
  const entriesElements = entries
  .filter((entry) => {
    if (props.search == '') return true;
    return entry.name.includes(props.search);
  })
  .map((entry) => {
    return <Entry
        key={entry.id.toString()}
        updateREST = {() => { return getEntriesFromREST() }}
        entryInfo={entry}
        setField={(id, link, newValue) => { handleSetField(id, link, newValue) }}>
      </Entry>;
  });

  return <div className="entries d-flex flex-row flex-wrap">
    { entriesElements }
    <AddEntryBlock updateREST={ () => { return getEntriesFromREST() } }/>
  </div>;
}

function Body() {
  const [search, setSearch] = useState('');

  const element = <div className="body">
    <Container>
      <LastAction/>
      <Search className="custom-search" emitSearch={(search) => { setSearch(search) }}/>
      <Entries search={search}/>
    </Container>
  </div>
  return element;
}

export function Crud() {
  return <div>
    <Header/>
    <Body/>
  </div>;
}