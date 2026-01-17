import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/login'
import OwnerList from './pages/owner_list'
import TeamList from './pages/team_list'
import PlayerList from './pages/player_list'
import TeamAdd from './pages/team_add'
import OwnerAdd from './pages/owner_add'
import PlayerAdd from './pages/player_add'
import TeamDetails from './pages/team_details'
import PlayerDetails from './pages/player_details'
import TeamUpdate from './pages/team_update'
import PlayerUpdate from './pages/player_update'
import OwnerUpdate from './pages/owner_update'


function App() {

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/owners" element={<OwnerList />} />
      <Route path="/teams" element={<TeamList />} />
      <Route path="/players/:id_team/:name" element={<PlayerList />} />
      <Route path="/team/add" element={<TeamAdd />} />
      <Route path="/owner/add" element={<OwnerAdd />} />
      <Route path="/player/add/:id_team/:name" element={<PlayerAdd />} />
      <Route path="/team/details/:id_team" element={<TeamDetails />} />
      <Route path="/player/details/:id_player" element={<PlayerDetails />} />
      <Route path="/team/update/:id_team" element={<TeamUpdate />} />
      <Route path="/player/update/:id_player" element={<PlayerUpdate />} />
      <Route path="/owner/update/:id_user" element={<OwnerUpdate />} />
    </Routes>
  )
}

export default App
