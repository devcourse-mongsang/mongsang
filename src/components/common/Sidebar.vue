<script setup>
import DropDownCommunity from "./DropDownCommunity.vue";
import Headers from "./Headers.vue";
</script>

<template>
  <Headers />
  <div
    id="sidebar"
    class="w-[250px] h-full absolute top-0 left-[-250px] z-10 transition-all ease-in-out duration-450 peer-checked:left-0 pt-[105px] backdrop-blur-[11px] text-white flex flex-col gap-2 rounded-[0px_30px_30px_0px] bg-gradient-to-b from-[rgba(34,193,233,0.5)] to-[rgba(184,58,155,0.4)] peer-checked:shadow-[0px_4px_74.8px_#688FB69E,0px_4px_70px_#FFF_inset] pl-10"
  >
    <div>프로필 영역</div>
    <div>알림 영역</div>
    <nav>
      <DropDownCommunity />
    </nav>
  </div>
</template>
