import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FireStoreService } from 'src/app/modules/shared/services/fire-store.service';
import { Projects, UserProfile } from 'src/app/modules/shared/interfaces';


@Component({
  selector: 'app-projects-admin',
  templateUrl: './projects-admin.component.html',
  styleUrls: ['./projects-admin.component.css']
})
export class ProjectsAdminComponent implements OnInit, OnChanges {
      
  @Input() edit!: Projects|null;
  @Input() openPanel = false;
  
  @Output() addEvent:EventEmitter<Projects> = new EventEmitter();
  @Output() editEvent:EventEmitter<Projects> = new EventEmitter();
  @Output() focusEvent:EventEmitter<any> = new EventEmitter();
  @Output() panelEvent:EventEmitter<any> = new EventEmitter();
  
  projectsForm = this.fb.group({
    lang: ['ES'],
    time: [new Date()],
    tituloES:  ['', Validators.required],
    tituloEN:  ['', Validators.required],
    tituloFR:  ['', Validators.required],
    ciudad: ['', Validators.required],
    pais:  [''],
    sup: [''],
    hab: [''],
    bath: [''],
    year: [''],
    bModelES: [''],
    bModelEN: [''],
    bModelFR: [''],
    rentabilidad: [''],
    descES:[''],
    descEN:[''],
    descFR:[''],
    fotoAntes: ['', Validators.required],
    fotoDsps: ['', Validators.required],
    fotoFinal: ['', Validators.required],
    fotosObra: this.fb.array([]),
    public: [false],
    servicios: [['Bid','Bargain','Build','Business']],
    user: [''],
    rate:[]
  });
// this.fb.control([])
  get fotosObra(): FormArray {
    return this.projectsForm.get('fotosObra') as FormArray;
  }
  /**
   * Adds a new form field for "construction" fotos
   */
  newFotoObra(){
    this.fotosObra.push(new FormControl())
  }

  constructor(private fb: FormBuilder, private service: FireStoreService) {}

  ngOnInit(): void {
    this.getUsers();
  }
  ngOnChanges(): void {
    if (this.edit && this.edit.fotosObra) {
      const fo = this.edit.fotosObra;
      if(fo.length){
        this.fotosObra.clear();
        for (let i = 0; i < fo.length; i++){
          this.newFotoObra();
        }
      }
      this.projectsForm.patchValue({...this.edit});
    };
  }

  afterExpandFocus(){
      document.getElementById('firstField')?.focus();
  }

  addEditProject(form:FormGroup) {
    if (this.edit&&this.edit.id) {
      this.editEvent.emit(form.value);
    }
    else {
      this.addEvent.emit(form.value);
    }
    this.reset();
  }

  /**
   * This method is triggered when a file is received on upload file component, it receives the values and attach them to the form, 
   * which is later sent to the db on submit.
   * @param e file name and url received from the upload file component
   * @param i the current index of the form field
   */
  addDeleteObra(e: {img: string, URL: string}, i: number): void{
    const foArray = this.projectsForm.controls.fotosObra.value;
    if (e.URL){
      foArray[i]= e.URL;
      this.fotosObra.setValue(foArray);
    }
    else {
      this.fotosObra.removeAt(i);
    }
  }

  removeField(i: number){
    this.fotosObra.removeAt(i);
  }

  users!: UserProfile[];
  getUsers(){
    this.service.getUsers().valueChanges().subscribe((x:UserProfile[]) => {
      this.users = x.filter(y => y.role !== 'admin');
    })
  }

  reset(){
    this.fotosObra.clear();
    this.edit = null;
    this.projectsForm.reset();
    this.focusEvent.emit();
  }

  remove(i: number){
    this.projectsForm.value.servicios.splice(i, 1);
    console.warn(this.projectsForm.value.servicios)
  }

}