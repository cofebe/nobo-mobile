import { IonSelect } from '@ionic/react'
import React from 'react'

type DropdownOptions = {
value:string | number
label:string
}


type DropdownProps = {
value?:DropdownOptions
options:DropdownOptions[]
onChange:(value:DropdownOptions | undefined)=>void
}

const DropDown:React.FC<DropdownProps>= ({onChange, value, options }:DropdownProps) => {
  return (
   <IonSelect
   title='Select size'
   color='pink'
   slot='rrr'
   >

   </IonSelect>
  )
}

export default DropDown