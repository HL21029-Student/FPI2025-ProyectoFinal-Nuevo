<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary">
      <q-toolbar>
        <q-btn flat round dense icon="arrow_back" @click="$router.back()" />
        <q-toolbar-title class="text-center text-weight-bold"> Nuevo Anuncio </q-toolbar-title>
        <q-btn flat label="Cancelar" @click="$router.back()" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="crear-anuncio-mobile">
        <q-form @submit="submitForm" class="q-gutter-md q-pa-md">
          <!-- SUBIDA DE IMÁGENES MÓVIL -->
          <q-card class="q-mb-md">
            <q-card-section>
              <div class="text-h6 text-weight-bold q-mb-sm">Imágenes del Producto</div>
              <div class="row q-col-gutter-sm">
                <div v-for="n in 4" :key="n" class="col-6" @click="triggerFileInput(n)">
                  <div class="image-upload-slot rounded-borders bg-grey-3">
                    <q-icon
                      v-if="!uploadedFiles[n - 1]"
                      name="add_photo_alternate"
                      size="xl"
                      color="grey-6"
                    />
                    <q-img
                      v-else
                      :src="uploadedFiles[n - 1].preview"
                      ratio="1"
                      class="rounded-borders"
                    />
                  </div>
                </div>
              </div>
              <input
                ref="fileInput"
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                multiple
                class="hidden-file-input"
                @change="onFileInputChange"
              />
              <div class="text-caption text-grey-7 q-mt-sm">
                Toca para agregar imágenes (máx. 4)
              </div>
            </q-card-section>
          </q-card>

          <!-- TÍTULO DEL ANUNCIO -->
          <q-input
            v-model="form.tituloAnuncio"
            label="Título breve del anuncio"
            outlined
            required
            placeholder="Ej: iPhone 13 128GB como nuevo"
            class="q-mb-md"
            :rules="[(val) => !!val || 'El título es requerido']"
          />

          <!-- PRECIO -->
          <q-input
            v-model.number="form.precio"
            type="number"
            label="Precio"
            prefix="$"
            outlined
            required
            class="q-mb-md"
            :rules="[(val) => val > 0 || 'El precio debe ser mayor a 0']"
          />

          <!-- VENDEDOR Y TELÉFONO -->
          <div class="row q-col-gutter-sm q-mb-md">
            <div class="col-6">
              <q-input
                v-model="form.nombreVendedor"
                label="Vendedor"
                outlined
                required
                :rules="[(val) => !!val || 'El vendedor es requerido']"
              />
            </div>
            <div class="col-6">
              <q-input
                v-model="form.telefono"
                label="Teléfono"
                outlined
                required
                placeholder="7777-8888"
                :rules="[(val) => !!val || 'El teléfono es requerido']"
              />
            </div>
          </div>

          <!-- ESPECIFICACIONES TÉCNICAS -->
          <q-card class="q-mb-md">
            <q-card-section>
              <div class="text-h6 text-weight-bold q-mb-md">Especificaciones Técnicas</div>

              <!-- Estado -->
              <div class="q-mb-md">
                <div class="text-subtitle2 text-weight-medium q-mb-sm">Estado</div>
                <q-option-group
                  v-model="form.estado"
                  :options="estados"
                  color="primary"
                  inline
                  class="q-mb-md"
                />
              </div>

              <!-- Marca y Modelo -->
              <div class="row q-col-gutter-sm q-mb-md">
                <div class="col-6">
                  <q-select
                    v-model="form.marca"
                    :options="marcas"
                    label="Marca"
                    outlined
                    required
                    :rules="[(val) => !!val || 'La marca es requerida']"
                  />
                </div>
                <div class="col-6">
                  <q-input
                    v-model="form.modelo"
                    label="Modelo"
                    outlined
                    required
                    placeholder="Galaxy S24"
                    :rules="[(val) => !!val || 'El modelo es requerido']"
                  />
                </div>
              </div>

              <!-- Pantalla y Sistema -->
              <div class="row q-col-gutter-sm q-mb-md">
                <div class="col-6">
                  <q-input
                    v-model="form.pantalla"
                    label="Pantalla"
                    outlined
                    required
                    suffix="pulgadas"
                    placeholder="6.7"
                    :rules="[(val) => !!val || 'La pantalla es requerida']"
                  />
                </div>
                <div class="col-6">
                  <q-select
                    v-model="form.sistemaOperativo"
                    :options="sistemasOperativos"
                    label="Sistema Operativo"
                    outlined
                    required
                    :rules="[(val) => !!val || 'El sistema es requerido']"
                  />
                </div>
              </div>

              <!-- Almacenamiento y RAM -->
              <div class="row q-col-gutter-sm">
                <div class="col-6">
                  <q-input
                    v-model.number="form.rom"
                    type="number"
                    label="Almacenamiento"
                    outlined
                    required
                    suffix="GB"
                    placeholder="128"
                    :rules="[(val) => val > 0 || 'El almacenamiento es requerido']"
                  />
                </div>
                <div class="col-6">
                  <q-input
                    v-model="form.ram"
                    label="RAM"
                    outlined
                    required
                    suffix="GB"
                    placeholder="8"
                    :rules="[(val) => !!val || 'La RAM es requerida']"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- DESCRIPCIÓN -->
          <q-input
            v-model="form.descripcion"
            label="DESCRIPCIÓN"
            outlined
            type="textarea"
            rows="4"
            required
            placeholder="Describe el estado, accesorios incluidos, garantía..."
            class="q-mb-md"
            :rules="[(val) => !!val || 'La descripción es requerida']"
          />

          <!-- ESPACIADOR PARA BOTONES FIJOS -->
          <div style="height: 100px"></div>
        </q-form>

        <!-- BOTONES FIJOS EN PARTE INFERIOR -->
        <div class="fixed-buttons">
          <q-btn
            unelevated
            color="primary"
            label="Crear Anuncio"
            @click="submitForm"
            :loading="loading"
            :disable="!canSubmit"
            class="full-width"
            size="lg"
          />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { celularesService } from '../services/celularesService'

export default {
  name: 'CrearAnuncioPage',

  setup() {
    const router = useRouter()
    const $q = useQuasar()

    const loading = ref(false)
    const fileInput = ref(null)
    const uploadedFiles = ref([])

    const form = ref({
      estado: 'nuevo',
      marca: null,
      modelo: '',
      pantalla: '',
      sistemaOperativo: '',
      rom: '',
      ram: '',
      tituloAnuncio: '',
      nombreVendedor: '',
      telefono: '',
      descripcion: '',
      precio: null,
      imagenes: [],
    })

    const estados = [
      { label: 'Nuevo', value: 'nuevo' },
      { label: 'Usado', value: 'usado' },
    ]

    const marcas = [
      'Samsung',
      'Apple',
      'Xiaomi',
      'Google',
      'Motorola',
      'OnePlus',
      'Honor',
      'Huawei',
      'Otro',
    ]

    const sistemasOperativos = ['Android', 'iOS', 'Otro']

    const canSubmit = computed(() => {
      return (
        uploadedFiles.value.length > 0 &&
        form.value.tituloAnuncio &&
        form.value.precio > 0 &&
        form.value.nombreVendedor &&
        form.value.telefono &&
        form.value.marca &&
        form.value.modelo &&
        form.value.pantalla &&
        form.value.sistemaOperativo &&
        form.value.rom &&
        form.value.ram &&
        form.value.descripcion
      )
    })

    const triggerFileInput = () => {
      if (uploadedFiles.value.length >= 4) {
        $q.notify({
          message: 'Máximo 4 imágenes permitidas',
          color: 'warning',
          position: 'top',
        })
        return
      }
      fileInput.value?.click()
    }

    const onFileInputChange = (event) => {
      const files = Array.from(event.target.files || [])

      if (uploadedFiles.value.length + files.length > 4) {
        $q.notify({
          message: 'Máximo 4 imágenes permitidas',
          color: 'warning',
          position: 'top',
        })
        return
      }

      for (const file of files) {
        if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
          $q.notify({
            message: `Tipo de archivo no permitido: ${file.name}`,
            color: 'negative',
            position: 'top',
          })
          continue
        }

        const reader = new FileReader()
        reader.onload = (e) => {
          uploadedFiles.value.push({
            preview: e.target.result,
            file: file,
          })
        }
        reader.readAsDataURL(file)
      }

      event.target.value = ''
    }

    const submitForm = async () => {
      if (!canSubmit.value) {
        $q.notify({
          message: 'Completa todos los campos requeridos',
          color: 'warning',
          position: 'top',
        })
        return
      }

      loading.value = true

      try {
        // Formatear datos para Firebase
        const productoData = {
          ...form.value,
          pantalla: `${form.value.pantalla} pulgadas`,
          rom: `${form.value.rom} GB`,
          ram: `${form.value.ram} GB`,
          imagen: uploadedFiles.value[0]?.preview, // Primera imagen como principal
          imagenes: uploadedFiles.value.map((file) => file.preview), // Todas las imágenes
        }

        await celularesService.addCelular(productoData)

        $q.notify({
          message: '✅ Anuncio creado exitosamente',
          color: 'positive',
          icon: 'check_circle',
          position: 'top',
          timeout: 3000,
        })

        router.push('/')
      } catch (error) {
        console.error('Error creando anuncio:', error)
        $q.notify({
          message: '❌ Error al crear el anuncio',
          color: 'negative',
          icon: 'error',
          position: 'top',
          timeout: 5000,
        })
      } finally {
        loading.value = false
      }
    }

    return {
      loading,
      fileInput,
      uploadedFiles,
      form,
      estados,
      marcas,
      sistemasOperativos,
      canSubmit,
      triggerFileInput,
      onFileInputChange,
      submitForm,
    }
  },
}
</script>

<style scoped>
.crear-anuncio-mobile {
  padding-bottom: 120px;
}

.image-upload-slot {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #ccc;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.image-upload-slot:hover {
  border-color: #1976d2;
  background-color: #f5f5f5;
}

.fixed-buttons {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: white;
  border-top: 1px solid #e0e0e0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.hidden-file-input {
  display: none;
}
</style>
