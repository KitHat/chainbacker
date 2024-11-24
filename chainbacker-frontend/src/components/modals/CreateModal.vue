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
      <Step>Add target sum and end date</Step>
      <StepPanel v-slot="{ activateCallback }">
        <div class="flex flex-col">
          <Fluid>
            <DatePicker placeholder="End fundraising date" v-model="form.expirationDate" class="mb-4" />
          </Fluid>
          <Fluid>
            <InputNumber placeholder="Sum" v-model="form.totalSum" inputId="withoutgrouping" :useGrouping="false" fluid />
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
          <div v-for="(tier, index) in form.tiers" :key="index" class="reward-tier">
            <div class="tier-card">
              <div class="flex justify-between items-center mb-4">
                <span class="text-xl">Tier {{ index + 1 }}</span>
                <Button rounded @click="removeTier(index)">X</Button>
              </div>
              <section>
                <InputText fluid class="mb-4" v-model="tier.title" placeholder="Tier title" />
                <Textarea fluid class="mb-4" v-model="tier.description" rows="3" placeholder="Describe the reward for this tier" />
                <InputNumber fluid v-model="tier.price" placeholder="Tier price" />
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
      <Step>Add milestones</Step>
      <StepPanel v-slot="{ activateCallback }">
        <div class="flex flex-col">
          <div v-for="(milestone, index) in form.milestones" :key="index" class="reward-tier">
            <div class="tier-card">
              <div class="flex justify-between items-center mb-4">
                <span class="text-xl">milestone {{ index + 1 }}</span>
                <Button rounded @click="removeMilestone(index)">X</Button>
              </div>
              <section>
                <DatePicker fluid placeholder="Milestone date" v-model="milestone.date" class="mb-4" />
                <Textarea fluid class="mb-4" v-model="milestone.description" rows="3" placeholder="milestone title" />
              </section>
            </div>
          </div>
        </div>
        <div class="py-6 flex gap-2">
          <Button fluid label="Next" @click="activateCallback('5')" />
          <Button fluid severity="contrast" label="Add milestone"  @click="addMilestone" />
        </div>
      </StepPanel>
    </StepItem>
    <StepItem value="5">
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
import { reactive, ref } from "vue";
import { DatePicker, InputNumber, Textarea, FileUpload } from "primevue";
import {useCustomFetch} from "@/composables/useCustomFetch.ts";
import {Endpoints} from "@/constants/endpoints.ts";
import {KickStage, KickType} from "@/constants/kick.ts";

const emit = defineEmits(['onClose'])

const form = reactive({
  title: '',
  description: '',
  expirationDate: new Date,
  totalSum: 0,
  raisedSum: 0,
  file: null,
  tiers: [
    { title: '', description: '', price: 0 }
  ],
  milestones: [{
    date: new Date,
    description: ''
  }]
})

const onSubmit = () => {
  const res = useCustomFetch(Endpoints.KICKS).post({
    title: form.title,
    creator: 'detoner',
    description: form.description,
    type: KickType.Tech,
    expirationDate: form.expirationDate.getTime(),
    totalSum: form.totalSum,
    raisedSum: 0,
    file: '',
    tiers: form.tiers.map(item => ({...item, limit: 1,
      bought: 1})),
    milestones: form.milestones.map((item, index) => ({ date: item.date.getTime(), description: item.description, part: index + 1 })),
    status: KickStage.Active,
    address: 'deployed address kick',
  }).json()

  console.warn('res', res)

  emit('onClose')
}

const addTier = () => {
  form.tiers.push({ title: '', description: '', price: 0 });
};

const removeTier = (index: number) => {
  form.tiers.splice(index, 1);
};

const addMilestone = () => {
  form.milestones.push({
    date: new Date,
    description: ''
  });
};

const removeMilestone = (index: number) => {
  form.milestones.splice(index, 1);
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
</script>

<style scoped>
.tier-card {
  padding: 8px;
  margin-bottom: 1rem;
}
</style>
