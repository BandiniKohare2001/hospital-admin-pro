import React, { useEffect, useState } from 'react';
import { ipdpatientlist } from '../../data/ipdpatientlist';
import IpdPatientListCard from './../../components/IpdPatientList/IpdPatientListCard'
import IpdHeader from './../../components/IpdHeader/IpdHeader'
import "./Ipd.css";
import Header from '../../components/Header/Header';
import Dashboard from '../../components/Sidebar/Sidebar';
import bed from './bed.png'
import add from './add.png'
import showToast from 'crunchy-toast';
import {saveListToLocalStorage} from './../../data/localstorage';


function Ipd() {
  const [patients, setPatients] = useState(ipdpatientlist);
  const [searchTerm, setSearchTerm] = useState('')

  const [srNo, setSrNo] = useState('');
  const [id, setId] = useState(0);
  const [patientName, setPatientName] = useState('');
  const [room, setRoom] = useState('');
  const [bedNo, setBedNo] = useState('');
  const [isEdit, setIsEdit] = useState('');


  useEffect(() => {
    const filteredPatients = ipdpatientlist.filter((patient) => {
      const name = patient.patientName.toLocaleLowerCase();
      const mobile = patient.id.toString();
      const query = searchTerm.toLowerCase();
      return (name.includes(query) || mobile.includes(query))
    })

    setPatients(filteredPatients);
  }, [searchTerm])

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem('taskminder'));
    if (list && list.lenght >= 0) {
      setPatients(list)
    }
  }, [])

  const findIndexByTaskId = (taskId) => {
    let index;

    patients.forEach((task, i) => {
      if (task.id === taskId) {
        index = i
      }
    })
    return index;
  }
  const clearInputFields = () => {
    setSrNo('')
    setPatientName('');
    setRoom('');
    setBedNo('');
  }

  const addPatientToList = () => {
    const randomId = Math.floor(Math.random() * 10000);
    const obj = {
      id: randomId,
      srNo: srNo,
      patientName: patientName,
      room: room,
      bedNo: bedNo
    }

    const newPatientList = [...patients, obj]
    setPatients(newPatientList)

    clearInputFields()

    saveListToLocalStorage(newPatientList);
    showToast('Patient added succesfully', 'success', 3000);
  }

  const removePatientFromList = (id) => {
    const index = findIndexByTaskId(id);
    const tempArray = patients;
    tempArray.splice(index, 1);

    setPatients([...tempArray])

    saveListToLocalStorage(tempArray)
    showToast('Task remove from list succesfully', 'success', 3000);
  }
  const setListEditable = (id) => {
    setIsEdit(true);
    setId(id);

    const currentEditlist = findIndexByTaskId(id);
    setSrNo(currentEditlist.srNo)
    setPatients(currentEditlist.patientName);
    setRoom(currentEditlist.room);
    setBedNo(currentEditlist.bedNo);

    console.log(currentEditlist)
  }

  const UpdateList = () => {

    const indexToUpdate = findIndexByTaskId(id);

    const tempArray = patients;
    tempArray[indexToUpdate] = {
      id: id,
      srNo: srNo,
      patientName: patientName,
      room: room,
      bedNo: bedNo
    }
    setPatients([...tempArray])
    saveListToLocalStorage(tempArray);
    showToast('Task update succesfully', 'success', 3000);

    setId(-1);
    clearInputFields();
    setIsEdit(false);
  }

  return (
    <>
      <div className='d-flex'>
        <div><Dashboard /></div>
        <div className='ipd-list-div'>
          <Header />
          <div className='ipd-top-header d-flex'><img src={bed} /><h1 className='heading'>IPD Patient</h1>
          </div>

          <div className='search-div d-flex'>

            <div>
              <p className='search-bar pe-5'>Search Name/ID : &nbsp;<input
                type='text'
                placeholder='Search ID/Name' className='search'
                searchTerm={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value) }}
              /></p></div>

          </div>
          <div className='container-patien'>
            <div>
              <IpdHeader />
            </div>
            <div>
              {patients.map((patient, index) => {
                const { srNo, id, patientName, room, bedNo } = patient;

                return <IpdPatientListCard
                  key={index}
                  srNo={srNo}
                  id={id}
                  patientName={patientName}
                  room={room}
                  bedNo={bedNo}
                  removePatientFromList={removePatientFromList}
                  setListEditable ={setListEditable}

                />
              })}
            </div>
            {
              patients.length === 0 ? <span className='pa-center'>Patient is not found!</span> : null
            } </div><hr />
          <div>
            <h1 className='add-btn'><img src={add} />&nbsp; ADD PATIENT</h1>
            <div>
              <div>
                <h2 className="text-center">
                  {isEdit ? `Update ${id}` : 'Add Patient'}
                </h2>
                <div className="add-patient-to-list-container">
                  <form>

                  <input
                      type="text"
                      value={srNo}
                      onChange={(e) => {
                        setSrNo(e.target.value)
                      }}
                      placeholder="Enter Sr No."
                      className="task-input"
                    />
                  <input
                      type="text"
                      value={patientName}
                      onChange={(e) => {
                        setPatientName(e.target.value)
                      }}
                      placeholder="Enter Patient Name"
                      className="task-input"
                    />


                    <input
                      type="text"
                      value={room}
                      onChange={(e) => {
                        setRoom(e.target.value)
                      }}
                      placeholder="Room"
                      className="task-input"
                    />

                    <input
                      type="number"
                      value={bedNo}
                      onChange={(e) => {
                        setBedNo(e.target.value)
                      }}
                      placeholder="Bed No."
                      className="task-input"
                    />
                     {
                        isEdit ?

                          <button className="btn-add-task" type="button" onClick={UpdateList}>Update </button>
                          :
                          <button className="btn-add-task" type="button" onClick={addPatientToList}>Add Patient</button>

                      }


                  </form>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

    </>

  );
}

export default Ipd;
