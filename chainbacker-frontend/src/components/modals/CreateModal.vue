<template>
  <Stepper value="1">
    <StepItem value="1">
      <Step>Describe your project</Step>
      <StepPanel v-slot="{ activateCallback }">
        <div class="flex flex-col">
          <Fluid>
            <InputText class="mb-4" v-model="form.title" placeholder="title" />
          </Fluid>
          <Fluid>
            <Textarea v-model="form.description"  placeholder="description" rows="5" cols="30" />
          </Fluid>
        </div>
        <div class="py-6">
          <Button label="Next" @click="activateCallback('2')" />
        </div>
      </StepPanel>
    </StepItem>
    <StepItem value="2">
      <Step>Add date and sum</Step>
      <StepPanel v-slot="{ activateCallback }">
        <div class="flex flex-col">
          <Fluid>
            <DatePicker placeholder="End fundraising date" v-model="form.expirationDate" class="mb-4" />
          </Fluid>
          <Fluid>
            <InputNumber placeholder="Sum" v-model="form.sum" inputId="withoutgrouping" :useGrouping="false" fluid />
          </Fluid>
        </div>
        <div class="py-6">
          <Button label="Next" @click="activateCallback('3')" />
        </div>
      </StepPanel>
    </StepItem>
    <StepItem value="3">
      <Step>Add tiers</Step>
      <StepPanel v-slot="{ activateCallback }">
        <div class="flex flex-col">
          <div v-for="(tier, index) in rewardTiers" :key="index" class="reward-tier">
            <div class="tier-card">
              <div class="flex justify-between items-center mb-4">
                <span class="text-xl">Tier {{ index + 1 }}</span>
                <Button rounded @click="removeTier(index)">X</Button>
              </div>
              <section>
                <InputText fluid class="mb-4" v-model="tier.title" placeholder="Tier title" />
                <Textarea fluid class="mb-4" v-model="tier.description" rows="3" placeholder="Describe the reward for this tier" />
                <InputNumber fluid v-model="tier.price" mode="currency" currency="USD" placeholder="Tier price" />
              </section>
            </div>
          </div>
        </div>
        <div class="py-6 flex gap-2">
          <Button fluid label="Next" @click="activateCallback('4')" />
          <Button fluid severity="contrast" label="Add Tier"  @click="addTier" />
        </div>
      </StepPanel>
    </StepItem>
    <StepItem value="4">
      <Step>Add image</Step>
      <StepPanel>
        <div class="flex flex-col">
          <FileUpload mode="basic"
                      name="image"
                      accept="image/*"
                      customUpload
                      @select="onFileSelect"
                      chooseLabel="Choose Image"
          />
          <div v-if="imageData" class="mt-2 image-preview">
            <img :src="imageData" alt="Image Preview" class="preview-img" />
          </div>
        </div>
        <div class="py-6">
          <Button fluid label="Submit" @click="onSubmit" />
        </div>
      </StepPanel>
    </StepItem>

  </Stepper>
</template>

<script setup lang="ts">
import Stepper from 'primevue/stepper';
import StepItem from 'primevue/stepitem';
import Step from 'primevue/step';
import StepPanel from 'primevue/steppanel';
import InputText from "primevue/inputtext";
import Fluid from "primevue/fluid";
import Button from "primevue/button";
import {reactive, ref} from "vue";
import { DatePicker, InputNumber, Textarea, FileUpload } from "primevue";

const emit = defineEmits(['onClose'])
const onSubmit = () => {
  emit('onClose')
}

const form = reactive({
  title: '',
  description: '',
  expirationDate: new Date,
  sum: 0,
  file: null
})

const rewardTiers = ref([
  { title: '', description: '', price: null }
]);

const addTier = () => {
  rewardTiers.value.push({ title: '', description: '', price: null });
};

const removeTier = (index: number) => {
  rewardTiers.value.splice(index, 1);
};

const imageData = ref<string | null>(null);

const onFileSelect = (event: { files: File[] }) => {
  const file = event.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target && typeof e.target.result === 'string') {
        imageData.value = e.target.result;
      }
    };

    reader.readAsDataURL(file);
  }
};

//blockchain tiers, date, sum
// api
</script>

<style scoped>
.tier-card {
  padding: 8px;
  margin-bottom: 1rem;
}
</style>
