<template>
  <q-dialog v-model="showDialog" persistent :full-width="$q.screen.lt.md">
    <q-card
      class="create-product-dialog-card"
      :style="$q.screen.lt.md ? 'width: 100%; max-width: 100%' : 'width: 1000px'"
    >
      <!-- Header -->
      <q-card-section class="bg-blue-7 text-white q-py-sm">
        <div class="row items-center">
          <div class="text-h6 text-weight-bold text-center col dialog-header-title">
            NUEVO ANUNCIO
          </div>
          <q-btn icon="close" flat round dense v-close-popup color="white" size="sm" />
        </div>
      </q-card-section>

      <q-card-section class="q-pa-md dialog-content-section">
        <!-- Layout responsive: columnas en desktop, filas en móvil -->
        <div class="row q-col-gutter-md" :class="$q.screen.lt.md ? 'flex-column' : ''">
          <!-- Columna izquierda: Especificaciones técnicas e imágenes -->
          <div :class="$q.screen.lt.md ? 'col-12' : 'col-5'">
            <!-- En móvil, mostrar primero las imágenes -->
            <div v-if="$q.screen.lt.md" class="q-mb-md">
              <q-card flat bordered class="bg-white">
                <q-card-section class="q-pa-sm">
                  <div class="text-body2 text-weight-bold q-mb-sm">Imágenes</div>
                  <div class="preview-box-mobile" @click="triggerFileInput">
                    <q-icon name="add_photo_alternate" size="3rem" color="grey-5" />
                    <div class="text-caption text-grey-6 q-mt-sm">Tocar para agregar imágenes</div>
                  </div>
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    multiple
                    class="hidden-file-input"
                    @change="onFileInputChange"
                  />

                  <!-- Vista previa de imágenes en móvil -->
                  <div v-if="uploadedFiles.length > 0" class="q-mt-sm">
                    <div class="row q-col-gutter-xs">
                      <div v-for="(file, index) in uploadedFiles" :key="index" class="col-3">
                        <q-img
                          :src="file.preview"
                          ratio="1"
                          class="rounded-borders"
                          style="border: 2px solid #e0e0e0"
                        />
                      </div>
                    </div>
                    <div class="text-caption text-grey-7 q-mt-xs">
                      {{ uploadedFiles.length }} imagen(es) seleccionada(s)
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- Especificaciones técnicas -->
            <q-card flat bordered class="q-mb-md bg-white">
              <q-card-section>
                <div class="text-body2 text-weight-bold q-mb-sm">Estado:</div>
                <q-option-group
                  v-model="form.estado"
                  :options="estados"
                  color="primary"
                  :inline="!$q.screen.lt.md"
                  dense
                  class="q-mb-sm text-body2"
                />

                <div class="q-gutter-sm">
                  <!-- Campos de especificaciones adaptados para móvil -->
                  <div class="row items-center no-wrap q-mb-sm">
                    <div :class="$q.screen.lt.md ? 'col-4' : 'col-3'">
                      <div class="text-body2 text-weight-medium">Marca:</div>
                    </div>
                    <div :class="$q.screen.lt.md ? 'col-8' : 'col-9'">
                      <q-select
                        v-model="form.marca"
                        :options="marcas"
                        outlined
                        dense
                        required
                        class="small-select"
                      />
                    </div>
                  </div>

                  <div class="row items-center no-wrap q-mb-sm">
                    <div :class="$q.screen.lt.md ? 'col-4' : 'col-3'">
                      <div class="text-body2 text-weight-medium">Modelo:</div>
                    </div>
                    <div :class="$q.screen.lt.md ? 'col-8' : 'col-9'">
                      <q-input v-model="form.modelo" outlined dense required class="small-input" />
                    </div>
                  </div>

                  <div class="row items-center no-wrap q-mb-sm">
                    <div :class="$q.screen.lt.md ? 'col-4' : 'col-3'">
                      <div class="text-body2 text-weight-medium">Pantalla:</div>
                    </div>
                    <div :class="$q.screen.lt.md ? 'col-5' : 'col-5'">
                      <q-input v-model="form.pantalla" outlined dense required suffix="pulgadas" />
                    </div>
                  </div>

                  <div class="row items-center no-wrap q-mb-sm">
                    <div :class="$q.screen.lt.md ? 'col-4' : 'col-3'">
                      <div class="text-body2 text-weight-medium">Sistema:</div>
                    </div>
                    <div :class="$q.screen.lt.md ? 'col-8' : 'col-9'">
                      <q-select
                        v-model="form.sistemaOperativo"
                        :options="sistemasOperativos"
                        outlined
                        dense
                        required
                        class="small-select"
                      />
                    </div>
                  </div>

                  <div class="row items-center no-wrap q-mb-sm q-col-gutter-xs">
                    <div :class="$q.screen.lt.md ? 'col-4' : 'col-3'">
                      <div class="text-body2 text-weight-medium">ROM</div>
                    </div>
                    <div :class="$q.screen.lt.md ? 'col-5' : 'col-5'">
                      <q-input
                        v-model.number="form.rom"
                        type="number"
                        min="0"
                        outlined
                        dense
                        required
                      />
                    </div>
                    <div :class="$q.screen.lt.md ? 'col-3' : 'col-4'">
                      <q-select
                        v-model="romUnit"
                        :options="romOptions"
                        outlined
                        dense
                        class="small-select"
                      />
                    </div>
                  </div>

                  <div class="row items-center no-wrap q-mb-sm">
                    <div :class="$q.screen.lt.md ? 'col-4' : 'col-3'">
                      <div class="text-body2 text-weight-medium">RAM</div>
                    </div>
                    <div :class="$q.screen.lt.md ? 'col-5' : 'col-5'">
                      <q-input v-model="form.ram" outlined dense required suffix="GB" />
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <!-- Sección de imágenes (solo en desktop) -->
            <div v-if="$q.screen.gt.sm">
              <q-card flat bordered class="bg-white">
                <q-card-section class="q-pa-sm">
                  <div class="text-body2 text-weight-bold q-mb-sm">Imágenes</div>

                  <div class="row">
                    <!-- Botones y tabla -->
                    <div class="col-6">
                      <div class="row q-gutter-xs q-mb-sm">
                        <q-btn
                          round
                          color="primary"
                          icon="add"
                          size="sm"
                          @click="triggerFileInput"
                        />
                        <q-btn
                          round
                          color="negative"
                          icon="remove"
                          size="sm"
                          :disable="uploadedFiles.length === 0"
                          @click="removeLastFile"
                        />
                        <input
                          ref="fileInput"
                          type="file"
                          accept="image/jpeg,image/jpg,image/png"
                          multiple
                          class="hidden-file-input"
                          @change="onFileInputChange"
                        />
                      </div>

                      <!-- Tabla de archivos -->
                      <q-markup-table flat bordered dense separator="cell" class="small-table">
                        <thead>
                          <tr>
                            <th class="text-center table-header-n">N</th>
                            <th class="text-center table-header-size">Tamaño</th>
                            <th class="text-center table-header-type">Tipo</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="file in uploadedFiles.slice(0, 4)" :key="file.numero">
                            <td class="text-center text-caption">{{ file.numero }}</td>
                            <td class="text-center text-caption">{{ file.size }}</td>
                            <td class="text-center text-caption">{{ file.type }}</td>
                          </tr>
                          <tr
                            v-for="n in Math.max(0, 4 - uploadedFiles.length)"
                            :key="'empty-' + n"
                          >
                            <td class="text-center text-caption text-grey">
                              {{ uploadedFiles.length + n }}
                            </td>
                            <td class="text-center text-caption text-grey">-</td>
                            <td class="text-center text-caption text-grey">-</td>
                          </tr>
                        </tbody>
                      </q-markup-table>
                    </div>

                    <!-- Preview -->
                    <div class="col-6">
                      <div class="preview-box">
                        <div v-if="uploadedFiles.length > 0" class="preview-image">
                          <q-img
                            :src="uploadedFiles[previewSlide].preview"
                            fit="contain"
                            class="preview-image-content"
                          />
                        </div>
                        <div v-else class="preview-placeholder">
                          <!-- Cuadrado punteado vacío -->
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Errores -->
                  <div v-if="errors.length > 0" class="q-mt-sm">
                    <q-banner class="bg-negative text-white" dense rounded>
                      <div v-for="error in errors" :key="error" class="text-caption">
                        {{ error }}
                      </div>
                    </q-banner>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <!-- Columna derecha: Información del anuncio -->
          <div :class="$q.screen.lt.md ? 'col-12' : 'col-7'">
            <div class="q-gutter-sm">
              <!-- Título del anuncio -->
              <div>
                <div class="text-body2 text-weight-bold q-mb-xs">Título breve del anuncio</div>
                <q-input
                  v-model="form.tituloAnuncio"
                  outlined
                  dense
                  required
                  placeholder="Ejemplo: Iphone 6 pantalla de 8 pulgadas, 64Gb internos"
                  bg-color="white"
                />
              </div>

              <!-- Vendedor y Teléfono en fila en desktop, columna en móvil -->
              <div class="row q-col-gutter-sm">
                <div :class="$q.screen.lt.md ? 'col-12 q-mb-sm' : 'col-6'">
                  <div class="text-body2 text-weight-bold q-mb-xs">Vendedor:</div>
                  <q-input
                    v-model="form.nombreVendedor"
                    outlined
                    dense
                    required
                    placeholder="Juan Perez"
                    bg-color="white"
                  />
                </div>
                <div :class="$q.screen.lt.md ? 'col-12' : 'col-6'">
                  <div class="text-body2 text-weight-bold q-mb-xs">Teléfono</div>
                  <q-input
                    v-model="form.telefono"
                    outlined
                    dense
                    required
                    placeholder="21213-1212"
                    bg-color="white"
                  />
                </div>
              </div>

              <!-- Descripción -->
              <div>
                <div class="text-body2 text-weight-bold q-mb-xs">DESCRIPCIÓN</div>
                <q-input
                  v-model="form.descripcion"
                  outlined
                  type="textarea"
                  :rows="$q.screen.lt.md ? 3 : 5"
                  required
                  placeholder="Teléfono en muy buenas condiciones, tiene dos cámaras..."
                  bg-color="white"
                />
              </div>

              <!-- Precio -->
              <q-card flat bordered class="bg-white">
                <q-card-section class="q-pa-sm">
                  <div class="text-body2 text-weight-bold text-center q-mb-xs">PRECIO</div>
                  <div class="row justify-center">
                    <q-input
                      v-model.number="form.precio"
                      type="number"
                      outlined
                      dense
                      prefix="$"
                      required
                      class="text-h6 price-input"
                      bg-color="white"
                      :style="$q.screen.lt.md ? 'width: 100%' : ''"
                    />
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
      </q-card-section>

      <!-- Footer con botones -->
      <q-card-actions align="center" class="q-pa-sm bg-grey-3">
        <q-btn
          outline
          color="dark"
          label="Cancelar"
          icon="cancel"
          v-close-popup
          size="md"
          class="q-px-lg"
        />
        <q-btn
          unelevated
          color="primary"
          label="Crear"
          icon="save"
          @click="submitForm"
          :loading="loading"
          :disable="!canSubmit"
          size="md"
          class="q-px-lg"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { celularesService } from '../services/celularesService'

export default {
  name: 'CrearProductoDialog',

  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const $q = useQuasar()
    const router = useRouter()

    const showDialog = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value),
    })

    const loading = ref(false)
    const fileInput = ref(null)
    const uploadedFiles = ref([])
    const previewSlide = ref(0)
    const errors = ref([])
    const romUnit = ref('GB')
    const romOptions = ['GB', 'TB']

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
      'Motorola',
      'OnePlus',
      'Google',
      'Sony',
      'LG',
      'Otro',
    ]

    const sistemasOperativos = ['Android', 'iOS', 'Otro']

    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const triggerFileInput = () => {
      if (uploadedFiles.value.length >= 4) {
        errors.value = ['Máximo 4 imágenes permitidas']
        return
      }
      fileInput.value?.click()
    }

    const onFileInputChange = (event) => {
      errors.value = []
      const files = Array.from(event.target.files || [])

      if (uploadedFiles.value.length + files.length > 4) {
        errors.value = ['Máximo 4 imágenes permitidas']
        return
      }

      for (const file of files) {
        if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
          errors.value.push(`Tipo no permitido: ${file.name}`)
          continue
        }

        if (file.size > 153600) {
          errors.value.push(`Archivo muy grande: ${file.name} (máx 150KB)`)
          continue
        }

        const reader = new FileReader()
        reader.onload = (e) => {
          uploadedFiles.value.push({
            numero: uploadedFiles.value.length + 1,
            name: file.name,
            size: formatFileSize(file.size),
            type: file.type.split('/')[1].toUpperCase(),
            file: file,
            preview: e.target.result,
          })
        }
        reader.readAsDataURL(file)
      }

      event.target.value = ''
    }

    const removeLastFile = () => {
      if (uploadedFiles.value.length > 0) {
        uploadedFiles.value.pop()
        uploadedFiles.value.forEach((f, i) => {
          f.numero = i + 1
        })
      }
    }

    const canSubmit = computed(() => {
      return (
        uploadedFiles.value.length > 0 &&
        form.value.estado &&
        form.value.marca &&
        form.value.modelo &&
        form.value.pantalla &&
        form.value.sistemaOperativo &&
        form.value.rom &&
        form.value.ram &&
        form.value.tituloAnuncio &&
        form.value.nombreVendedor &&
        form.value.telefono &&
        form.value.descripcion &&
        form.value.precio > 0
      )
    })

    const submitForm = async () => {
      if (!canSubmit.value) {
        $q.notify({
          message: 'Completa todos los campos requeridos y sube al menos una imagen',
          color: 'warning',
          icon: 'warning',
          position: 'top',
        })
        return
      }

      loading.value = true

      try {
        form.value.pantalla = `${form.value.pantalla} pulgadas`
        form.value.rom = `${form.value.rom} ${romUnit.value}`
        form.value.ram = `${form.value.ram} GB`
        form.value.imagenes = uploadedFiles.value.map((file) => file.preview)
        await celularesService.addCelular(form.value)

        $q.notify({
          message: '✅ Producto creado exitosamente',
          color: 'positive',
          icon: 'check_circle',
          position: 'top',
          timeout: 3000,
        })

        resetForm()
        showDialog.value = false
        router.push('/')
      } catch (error) {
        console.error('Error creando producto:', error)
        $q.notify({
          message: '❌ Error al crear el producto: ' + (error.message || 'Error desconocido'),
          color: 'negative',
          icon: 'error',
          position: 'top',
          timeout: 5000,
        })
      } finally {
        loading.value = false
      }
    }

    const resetForm = () => {
      form.value = {
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
      }
      uploadedFiles.value = []
      errors.value = []
      romUnit.value = 'GB'
      previewSlide.value = 0
    }

    watch(showDialog, (newVal) => {
      if (!newVal) {
        resetForm()
      }
    })

    return {
      showDialog,
      loading,
      fileInput,
      uploadedFiles,
      previewSlide,
      errors,
      form,
      estados,
      marcas,
      sistemasOperativos,
      romUnit,
      romOptions,
      canSubmit,
      triggerFileInput,
      onFileInputChange,
      removeLastFile,
      submitForm,
    }
  },
}
</script>

<style scoped>
.preview-box {
  border: 2px dashed #666;
  border-radius: 4px;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  position: relative;
}

.preview-box-mobile {
  border: 2px dashed #666;
  border-radius: 8px;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  cursor: pointer;
  transition: all 0.3s ease;
}

.preview-box-mobile:hover {
  border-color: #1976d2;
  background-color: #e3f2fd;
}

.dialog-header-title {
  font-style: italic;
}

.create-product-dialog-card {
  background-color: var(--q-primary-50);
}

.dialog-content-section {
  overflow-y: auto;
}

.preview-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.preview-image {
  width: 100%;
  padding: 4px;
  position: relative;
  background-color: white;
}

.preview-image-content {
  max-height: 140px;
}

.hidden-file-input {
  display: none;
}

.small-table {
  font-size: 11px;
}

.small-table th,
.small-table td {
  padding: 2px 4px !important;
}

.table-header-n {
  width: 30px;
}

.table-header-size {
  width: 60px;
}

.table-header-type {
  width: 50px;
}

.small-input :deep(.q-field__control),
.small-select :deep(.q-field__control) {
  min-height: 32px !important;
  padding: 0 8px !important;
  background-color: white;
}

.small-input :deep(.q-field__native),
.small-select :deep(.q-field__native) {
  padding: 4px 0 !important;
  font-size: 13px !important;
}

/* Ocultar flechas de los inputs de tipo número */
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
  appearance: textfield;
}

.price-input {
  max-width: 150px;
}

.add-photo-btn {
  border: 2px dashed #ccc;
  color: #888;
}
.add-photo-btn:hover {
  border-color: var(--q-primary);
  color: var(--q-primary);
}

/* Ajustes responsive adicionales */
@media (max-width: 768px) {
  .create-product-dialog-card {
    margin: 0;
    height: 100vh;
    max-height: 100vh;
  }

  .dialog-content-section {
    max-height: calc(100vh - 140px);
    overflow-y: auto;
  }

  .small-input :deep(.q-field__control),
  .small-select :deep(.q-field__control) {
    min-height: 40px !important;
    padding: 0 12px !important;
  }

  .small-input :deep(.q-field__native),
  .small-select :deep(.q-field__native) {
    padding: 8px 0 !important;
    font-size: 14px !important;
  }
}
</style>
